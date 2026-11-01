#!/usr/bin/env bash
# Deploy a release CI built for a commit of origin/main on the droplet: unpack it beside the live
# one, point `current` at it, pm2 restart, health check, and put the previous release back if it
# fails. Nothing is installed or built here, so the live process keeps its files and the shared
# 2 GB droplet stays out of swap.
# Runs as stern9, by hand or as the forced command of the GitHub Actions deploy key.
#   scripts/deploy.sh < release.tgz          deploy origin/main
#   scripts/deploy.sh <sha> < release.tgz    deploy that commit (40 hex characters, on origin/main)
# The release on stdin is the tarball scripts/package-release.sh makes in CI (the "release"
# artifact of a CI run); its RELEASE_SHA must name the commit being deployed.
# Under the forced command the only input besides that tarball is SSH_ORIGINAL_COMMAND, and the
# only accepted value is one full sha.
# Layout in the checkout: releases/<UTC time>-<short sha>/ (the live release and the one before
# it), current -> releases/<live>, and scripts/start.sh (npm start, run by pm2) serving
# current/server.js. The checkout itself is fast-forwarded for this script and package.json.
# Roll back by hand: ln -sfn releases/<previous> current && pm2 restart stern9.dev
# Exit codes: 2 checkout not on main, commit not on origin/main or not a fast-forward, 3 release
# missing, corrupt or built from another commit (2 and 3 leave the site untouched), 4 restart or
# health check failed (previous release put back), 5 another deploy held the lock for 15
# minutes, 64 unexpected argument.
set -euo pipefail

REPO="${DEPLOY_REPO:-/home/stern9/stern9.dev}"
APP=stern9.dev
HEALTH_URL=http://127.0.0.1:3000/
# ours-budget deploys on the same 2 GB droplet; sharing its lock keeps its build from running
# while this one restarts the app, and keeps two deploys of this app apart
LOCK_FILE="${DEPLOY_LOCK_FILE:-/etc/ours-budget/deploy.lock}"
# A release is about 25 MB; anything far bigger is not one
MAX_RELEASE_BYTES=$((300 * 1024 * 1024))
# Runtime secrets stay in the checkout; each release links to them (Next.js reads them from
# server.js's directory)
ENV_FILES=(.env .env.production .env.local .env.production.local)

incoming=''
new_release=''
promoted=0

usage() {
  echo "usage: deploy.sh [<full commit sha on origin/main>] < release.tgz" >&2
}

is_full_sha() {
  [[ "$1" =~ ^[0-9a-f]{40}$ ]]
}

wait_healthy() {
  local deadline=$((SECONDS + 60))
  while (( SECONDS < deadline )); do
    if curl -fsS -o /dev/null --max-time 5 "$HEALTH_URL" 2>/dev/null; then return 0; fi
    sleep 3
  done
  return 1
}

cleanup() {
  if [ -n "$incoming" ]; then rm -f "$incoming"; fi
  # A failed release is removed, unless a failed rollback left current pointing at it
  if [ -n "$new_release" ] && [ "$promoted" = 0 ] &&
    [ "$(readlink current 2>/dev/null)" != "$new_release" ]; then
    rm -rf "$new_release"
  fi
}

# Save stdin to $incoming; fails on nothing, or on more than MAX_RELEASE_BYTES
receive_release() {
  if [ -t 0 ]; then
    echo "[Deploy] no release on stdin: run the CI deploy (workflow_dispatch redeploys main), or pipe in its release artifact" >&2
    return 1
  fi
  head -c $((MAX_RELEASE_BYTES + 1)) > "$incoming"
  local size
  size=$(wc -c < "$incoming")
  if (( size == 0 )); then
    echo "[Deploy] stdin was empty: no release was sent" >&2
    return 1
  fi
  if (( size > MAX_RELEASE_BYTES )); then
    echo "[Deploy] stdin is over $MAX_RELEASE_BYTES bytes: not a release" >&2
    return 1
  fi
}

# Unpack $incoming into $new_release and check it is a whole release of commit $1.
# Called from `if !`, where set -e is off, so every step checks its own result.
unpack_release() {
  local sha=$1 path name
  if ! mkdir "$new_release"; then
    new_release=''
    return 1
  fi
  if ! gzip -t "$incoming" 2>/dev/null || ! tar -xzf "$incoming" -C "$new_release"; then
    echo "[Deploy] the release does not unpack (corrupt or not a gzip tarball)" >&2
    return 1
  fi
  for path in server.js package.json .next/BUILD_ID .next/static public content/blog RELEASE_SHA; do
    if [ ! -e "$new_release/$path" ]; then
      echo "[Deploy] the release has no $path" >&2
      return 1
    fi
  done
  if [ "$(cat "$new_release/RELEASE_SHA")" != "$sha" ]; then
    echo "[Deploy] the release was built from $(head -c 40 "$new_release/RELEASE_SHA"), not $sha" >&2
    return 1
  fi
  for name in "${ENV_FILES[@]}"; do
    rm -f "${new_release:?}/$name" || return 1
    if [ -e "$REPO/$name" ]; then ln -s "$REPO/$name" "$new_release/$name" || return 1; fi
  done
}

# Atomically repoint `current` (relative, so the checkout can move) at releases/$1
point_current() {
  ln -sfn "releases/$1" current.next && mv -T current.next current
}

# Best effort, every step: the caller exits 4 whatever happens here.
# $1 the commit the checkout was on, $2 the release that was live ('' = a build made in the
# checkout itself, before the first release; start.sh falls back to it once current is gone)
roll_back() {
  git reset --quiet --keep "$1"
  if [ -n "$2" ]; then
    point_current "$2"
  else
    rm -f current
  fi
  pm2 restart "$APP"
  if wait_healthy; then
    echo "[Deploy] previous release (${2:-in-place build}) put back and answering 200; the checkout is back at $(git rev-parse --short HEAD)" >&2
  else
    echo "[Deploy] previous release (${2:-in-place build}) put back but NOT answering 200 at $HEALTH_URL: the site is down" >&2
  fi
}

# Keep the live release and the one before it; drop the in-place build of the pre-release
# deploys (about 1.7 GB of .next, .next.previous and node_modules), which nothing serves any more
prune() {
  local keep_live=$1 keep_previous=$2 dir
  for dir in releases/*/; do
    dir=${dir%/}
    [ -d "$dir" ] || continue
    case "${dir#releases/}" in
      "$keep_live" | "$keep_previous") ;;
      *) rm -rf "$dir" ;;
    esac
  done
  rm -rf .next .next.previous node_modules
}

main() {
  local target='' arg
  for arg in "$@"; do
    if is_full_sha "$arg" && [ -z "$target" ]; then
      target=$arg
    else
      usage
      exit 64
    fi
  done
  # sshd sets this only under a forced command: what the client sent, one full sha or nothing
  if [ -n "${SSH_ORIGINAL_COMMAND:-}" ]; then
    if ! is_full_sha "$SSH_ORIGINAL_COMMAND"; then
      usage
      exit 64
    fi
    target=$SSH_ORIGINAL_COMMAND
  fi
  cd "$REPO"

  # A forced command gets no login shell, so node, npm and pm2 come from nvm's default alias
  export NVM_DIR="$HOME/.nvm"
  set +u
  # shellcheck source=/dev/null
  . "$NVM_DIR/nvm.sh"
  nvm use --silent default
  set -u

  trap cleanup EXIT
  mkdir -p releases
  # Read the whole upload before waiting for the lock, so the sender is never left mid-stream
  incoming=$(mktemp releases/.incoming.XXXXXX)
  if ! receive_release; then exit 3; fi

  exec 9>"$LOCK_FILE"
  if ! flock -w 900 9; then
    echo "[Deploy] another deploy has held $LOCK_FILE for 15 minutes; nothing deployed" >&2
    exit 5
  fi

  # A rollback by hand leaves the checkout on a commit, not on main; do not deploy over it
  if [ "$(git rev-parse --abbrev-ref HEAD)" != main ]; then
    echo "[Deploy] the checkout is not on main (git checkout main to deploy again); nothing deployed" >&2
    exit 2
  fi

  git fetch --quiet origin main
  local previous from to
  previous=$(git rev-parse HEAD)
  from=$(git rev-parse --short HEAD)
  if [ -z "$target" ]; then
    target=$(git rev-parse origin/main)
  elif ! git merge-base --is-ancestor "$target" origin/main 2>/dev/null; then
    echo "[Deploy] $target is not a commit on origin/main; nothing deployed" >&2
    exit 2
  elif git merge-base --is-ancestor "$target" HEAD && [ "$target" != "$previous" ]; then
    # A later deploy took the lock first
    echo "[Deploy] the checkout ($from) already contains ${target:0:7}; nothing to do"
    exit 0
  fi
  to=$(git rev-parse --short "$target")

  if [ "$from" = "$to" ]; then
    echo "[Deploy] $to is already checked out; redeploying it"
  else
    echo "[Deploy] $from..$to"
    git --no-pager log --oneline "HEAD..$target"
  fi
  echo "[Deploy] node $(node -v), pm2 $(pm2 -v)"

  # Everything up to the swap leaves the live release alone, so a failure here needs no rollback
  local name live=''
  name="$(date -u +%Y%m%dT%H%M%SZ)-$to"
  # A redeploy of the same commit within the same second must not reuse the live directory
  if [ -e "releases/$name" ]; then name="$name-$$"; fi
  new_release="releases/$name"
  if ! unpack_release "$target"; then
    echo "[Deploy] nothing deployed" >&2
    exit 3
  fi
  rm -f "$incoming"
  if [ -L current ]; then
    live=$(readlink current)
    live=${live#releases/}
  fi
  if ! git merge --quiet --ff-only "$target"; then
    echo "[Deploy] the checkout cannot fast-forward to $to; nothing deployed" >&2
    exit 2
  fi

  if point_current "$name" && pm2 restart "$APP" && wait_healthy; then
    promoted=1
    # The deploy has succeeded; a cleanup failure is only worth a warning
    prune "$name" "$live" || echo "[Deploy] warning: could not remove old releases or the in-place build" >&2
    echo "[Deploy] $to is healthy (releases/$name)"
    exit 0
  fi

  echo "[Deploy] $to did not restart or answer 200 at $HEALTH_URL within 60 s; last app log lines:" >&2
  pm2 logs "$APP" --lines 30 --nostream >&2 || true
  roll_back "$previous" "$live" || true
  exit 4
}

# The whole file is parsed before main runs, so the merge can replace this script safely
if [ "${BASH_SOURCE[0]}" = "$0" ]; then
  main "$@"
fi
