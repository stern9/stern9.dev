# Nginx config for stern9.dev

Version-controlled copy of the droplet's Nginx config (issue #10). **Merging
changes nothing on the server.** Applying it is a manual step, described below.

| Repo file | Installs to |
| --- | --- |
| `stern9.dev.conf` | `/etc/nginx/sites-enabled/stern9.dev` |
| `conf.d/stern9-limits.conf` | `/etc/nginx/conf.d/stern9-limits.conf` |

`conf.d/stern9-limits.conf` only declares zones (`stern9_api`, `stern9_post`,
`stern9_conn`, `stern9_cache`). Nothing uses them except `stern9.dev.conf`, so
ours-budget's server block is unaffected.

What changes compared with the old file:

- `/api/*`: 5 req/s per IP, burst 20, then 429. Bodies capped at 32k.
- `/api/doofus` and `/api/send`: also 6 req/min per IP (burst 5) and 3
  concurrent requests per IP, then 429. No buffering, 300s read timeout.
- `/api/now-playing`, `/api/top-tracks` and `/api/og`: shared cache that uses
  only the app's `Cache-Control` (`s-maxage`, then `max-age`). `no-store`,
  responses without cache headers and POSTs are never stored. Responses carry
  `X-Cache-Status`.
- The proxy headers moved from `location /` to the server level so the new
  locations inherit them. Everything else is unchanged.

## Apply

Run on the droplet from the deployed checkout (`/home/stern9/stern9.dev`, once
the PR is merged and deployed).

```sh
cd /home/stern9/stern9.dev

# 1. Preflight: the live file should only differ by the changes above
#    (if Certbot has edited it since, merge those edits first), the current
#    config should test clean, and no "stern9_" zone should exist yet.
ls -l /etc/nginx/sites-enabled/stern9.dev
diff -u /etc/nginx/sites-enabled/stern9.dev ops/nginx/stern9.dev.conf
sudo nginx -t
sudo grep -rn 'stern9_' /etc/nginx/ || echo "no clashes"

# 2. Back up, outside any directory Nginx includes.
B=/var/backups/nginx-$(date +%Y%m%d-%H%M%S)
sudo mkdir -p "$B"
sudo cp -aL /etc/nginx/sites-enabled/stern9.dev "$B/stern9.dev"
echo "backup: $B"   # note this for rollback

# 3. Cache directory (Nginx won't create missing parent directories).
sudo install -d -o www-data -g www-data -m 700 /var/cache/nginx/stern9

# 4. Install. cp writes through a symlink if sites-enabled links to
#    sites-available.
sudo install -m 644 ops/nginx/conf.d/stern9-limits.conf /etc/nginx/conf.d/stern9-limits.conf
sudo cp ops/nginx/stern9.dev.conf /etc/nginx/sites-enabled/stern9.dev

# 5. Test, then reload (a graceful reload; no dropped connections).
sudo nginx -t && sudo systemctl reload nginx
```

If `nginx -t` fails, nothing has been reloaded. Run the rollback below.

## Verify

From a laptop. The 429 checks lock your own IP out briefly (a few seconds for
`/api/`, about a minute for the POST endpoints).

```sh
# Cache: MISS (or EXPIRED) first, then HIT. top-tracks stays MISS while its
# Cache-Control is no-store (blurb pending).
for i in 1 2; do curl -s -o /dev/null -D - https://stern9.dev/api/now-playing | grep -iE '^(cache-control|x-cache-status)'; done
for i in 1 2; do curl -s -o /dev/null -D - https://stern9.dev/api/top-tracks  | grep -iE '^(cache-control|x-cache-status)'; done

# /api/ limit: about 21 x 200, then 429s.
for i in $(seq 30); do curl -s -o /dev/null -w '%{http_code} ' https://stern9.dev/api/now-playing; done; echo

# POST limit, using invalid bodies so no email is sent: 6 x 400, then 429s.
for i in $(seq 8); do curl -s -o /dev/null -w '%{http_code} ' -X POST -H 'Content-Type: application/json' -d '{}' https://stern9.dev/api/send; done; echo

# Body cap: 413.
head -c 40000 /dev/zero | curl -s -o /dev/null -w '%{http_code}\n' -X POST --data-binary @- https://stern9.dev/api/send

# Doofus still streams: words should arrive gradually, not all at the end.
# (Wait a minute after the POST test above; this uses one Doofus reply.)
curl -N -X POST -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"Count to ten slowly."}]}' \
  https://stern9.dev/api/doofus
```

On the droplet:

```sh
sudo grep -E 'limiting (requests|connections)' /var/log/nginx/error.log | tail
sudo du -sh /var/cache/nginx/stern9
```

Also open https://stern9.dev and check the Doofus chat and the now-playing
widget, and that ours-budget still loads.

## Purge the cache

top-tracks may be cached for up to a day and `/api/og` for up to a week (their
`s-maxage`). To drop everything now:

```sh
sudo find /var/cache/nginx/stern9 -type f -delete
```

## Rollback

```sh
B=/var/backups/nginx-YYYYMMDD-HHMMSS   # the path printed in step 2
sudo cp "$B/stern9.dev" /etc/nginx/sites-enabled/stern9.dev
sudo rm /etc/nginx/conf.d/stern9-limits.conf
sudo nginx -t && sudo systemctl reload nginx
sudo rm -rf /var/cache/nginx/stern9    # optional
```

## Testing locally

The config was checked with the `nginx:1.24` Docker image (same version as the
droplet), with dummy Certbot files and a stub app on 127.0.0.1:3000: `nginx -t`,
429s, cache MISS/HIT/STALE, `no-store` never cached, POSTs never cached, and
Doofus-style streaming arriving chunk by chunk.
