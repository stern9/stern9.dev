#!/usr/bin/env bash
# Deploy a commit of origin/main on the droplet: fast-forward, npm ci, build, pm2 restart.
# Runs as stern9, by hand or as the forced command of the GitHub Actions deploy key.
#   scripts/deploy.sh          deploy origin/main
#   scripts/deploy.sh <sha>    deploy that commit (40 hex characters, on origin/main)
# Under the forced command the only input is SSH_ORIGINAL_COMMAND, and the only accepted
# value is one full sha.
# Exit codes: 2 checkout not on main or commit not on origin/main, 4 install, build or health
# failed (previous build put back), 5 another deploy held the lock for 15 minutes,
# 64 unexpected argument.
set -euo pipefail

REPO="${DEPLOY_REPO:-/home/stern9/stern9.dev}"
APP=stern9.dev
HEALTH_URL=http://127.0.0.1:3000/
# ours-budget deploys on the same 2 GB droplet; sharing its lock keeps the two builds from
# running at once, which can run the droplet out of memory
LOCK_FILE=/etc/ours-budget/deploy.lock

usage() {
  echo "usage: deploy.sh [<full commit sha on origin/main>]" >&2
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

# Best effort, every step: the caller exits 4 whatever happens here
roll_back() {
  git reset --quiet --keep "$1"
  npm ci --no-audit --no-fund
  if [ -d .next.previous ]; then
    rm -rf .next
    mv .next.previous .next
  fi
  pm2 restart "$APP"
  if wait_healthy; then
    echo "[Deploy] previous build put back and answering 200; the checkout is back at $(git rev-parse --short HEAD)" >&2
  else
    echo "[Deploy] previous build put back but NOT answering 200 at $HEALTH_URL: the site is down" >&2
  fi
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
    echo "[Deploy] $to is already checked out; rebuilding it"
  else
    echo "[Deploy] $from..$to"
    git --no-pager log --oneline "HEAD..$target"
  fi
  echo "[Deploy] node $(node -v), pm2 $(pm2 -v)"

  rm -rf .next.previous
  if [ -d .next ]; then cp -a .next .next.previous; fi

  git merge --quiet --ff-only "$target"
  if npm ci --no-audit --no-fund && npm run build && pm2 restart "$APP" && wait_healthy; then
    echo "[Deploy] $to is healthy"
    exit 0
  fi

  echo "[Deploy] $to did not install, build or answer 200 at $HEALTH_URL within 60 s; last app log lines:" >&2
  pm2 logs "$APP" --lines 30 --nostream >&2 || true
  roll_back "$previous" || true
  exit 4
}

# The whole file is parsed before main runs, so the merge can replace this script safely
if [ "${BASH_SOURCE[0]}" = "$0" ]; then
  main "$@"
fi
