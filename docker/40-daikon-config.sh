#!/bin/sh
# Runs at container start (the nginx image runs /docker-entrypoint.d/*.sh).
# Writes the optional /api proxy from DAIKON_API_UPSTREAM. The auth and API settings
# themselves are built into the app from src/config.
# ponytail: writes into /etc/nginx/daikon, so with readOnlyRootFilesystem mount writable
# emptyDirs on /etc/nginx/daikon, /var/cache/nginx, /var/run and /var/log/nginx.
set -eu

conf=/etc/nginx/daikon

fail() {
  echo "daikon-config: $1" >&2
  exit 1
}

if [ -n "${DAIKON_API_UPSTREAM:-}" ]; then
  upstream=${DAIKON_API_UPSTREAM%/}
  case "$upstream" in
    http://*) hostport=${upstream#http://} ;;
    *) fail "DAIKON_API_UPSTREAM must be http://host[:port], the gateway as this container reaches it" ;;
  esac
  case "$hostport" in
    "" | *[!A-Za-z0-9.:_-]*) fail "DAIKON_API_UPSTREAM must be http://host[:port] with no path" ;;
  esac
  # ponytail: the name resolves once, when nginx starts (it must resolve then). Fine for
  # Kubernetes Services (stable IPs, short names work); in docker-compose, restart this
  # container if the gateway container is recreated with a new IP.
  printf 'upstream daikon_api {\n    server %s;\n}\n' "$hostport" > "$conf/api.http.conf"
  {
    echo "location /api/ {"
    echo "    proxy_set_header Host ${hostport%:80};"
    cat <<'EOF'
    # $daikon_api_uri (nginx.conf) is the raw request URI minus /api, so %2F survives
    if ($daikon_api_uri = "") { return 400; }
    proxy_pass http://daikon_api$daikon_api_uri;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host $host;
    # nginx.conf adds X-Frame-Options to every response; two different values make
    # browsers ignore it, so drop the gateway's. Both CSPs stay: browsers enforce each.
    proxy_hide_header X-Frame-Options;
    # Kestrel's default request body limit is ~28.6 MiB; don't be the tighter one
    client_max_body_size 30m;
    # Batch imports and registrations can run past nginx's 60 s default
    proxy_read_timeout 300s;
}
EOF
  } > "$conf/api.server.conf"
  echo "daikon-config: proxying /api/ to http://$hostport"
else
  : > "$conf/api.http.conf"
  # Without a proxy, /api/ must not fall through to the SPA's index.html
  echo "location /api/ { return 404; }" > "$conf/api.server.conf"
fi
