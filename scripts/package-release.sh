#!/usr/bin/env bash
# Pack the output of `npm run build` into the release tarball scripts/deploy.sh unpacks:
# .next/standalone (server.js and the node_modules it traced) plus public/, .next/static and
# content/, which standalone does not copy in full, and RELEASE_SHA naming the commit.
#   scripts/package-release.sh <full commit sha> <output .tgz>
set -euo pipefail

if [ $# -ne 2 ] || ! [[ "$1" =~ ^[0-9a-f]{40}$ ]]; then
  echo "usage: package-release.sh <full commit sha> <output .tgz>" >&2
  exit 64
fi
sha=$1
out="$(cd "$(dirname "$2")" && pwd)/$(basename "$2")"
cd "$(dirname "$0")/.."

if [ ! -f .next/standalone/server.js ]; then
  echo "[Package] .next/standalone/server.js is missing: run npm run build (output: \"standalone\") first" >&2
  exit 1
fi

stage=$(mktemp -d)
trap 'rm -rf "$stage"' EXIT
cp -a .next/standalone/. "$stage/"
# Secrets stay on the droplet (deploy.sh links them in), never in the tarball
rm -f "$stage"/.env*
rm -rf "$stage/public" "$stage/content" "$stage/.next/static"
cp -a public content "$stage/"
cp -a .next/static "$stage/.next/static"
printf '%s\n' "$sha" > "$stage/RELEASE_SHA"

tar -C "$stage" -czf "$out" .
echo "[Package] $out: $(du -h "$out" | cut -f1) for ${sha:0:7}"
