#!/bin/sh
# npm start: pm2's stern9.dev process runs it from the checkout.
# Serves the release scripts/deploy.sh put in place (current/server.js). Without one it runs
# next start on a build made in this checkout: local use, and the one deploy (by the previous
# deploy.sh) that brings this script to the droplet before any release exists there.
set -e
cd "$(dirname "$0")/.."
if [ -f current/server.js ]; then
  # server.js listens on HOSTNAME:PORT; set both, since a shell may export its own HOSTNAME
  HOSTNAME=127.0.0.1 PORT=3000 exec node current/server.js
fi
exec next start -H 127.0.0.1 -p 3000
