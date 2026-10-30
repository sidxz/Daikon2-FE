#!/bin/sh
# Runs at container start (the nginx image runs /docker-entrypoint.d/*.sh).
# Writes the app's runtime settings (/config.js) and the /api proxy from DAIKON_* env vars.
# ponytail: writes into the image, so it needs a writable root filesystem; for
# readOnlyRootFilesystem, mount emptyDirs on /usr/share/nginx/html and /etc/nginx/daikon.
set -eu

html=/usr/share/nginx/html
conf=/etc/nginx/daikon

fail() {
  echo "daikon-config: $1" >&2
  exit 1
}

# Values are written into a JS string or an nginx directive, so only allow the
# characters URLs, GUIDs and OIDC scopes need (no quotes, backslashes, ; { } or newlines)
check() {
  case "$2" in
    *[!A-Za-z0-9:/._~%?=\&+\ -]*) fail "$1 contains characters that are not allowed" ;;
  esac
}

if [ -n "${DAIKON_OIDC_AUTHORITY:-}${DAIKON_OIDC_CLIENT_ID:-}${DAIKON_OIDC_SCOPE:-}" ]; then
  for name in DAIKON_OIDC_AUTHORITY DAIKON_OIDC_CLIENT_ID DAIKON_OIDC_SCOPE; do
    eval "value=\${$name:-}"
    [ -n "$value" ] || fail "$name is required when any DAIKON_OIDC_* is set"
    check "$name" "$value"
  done
  check DAIKON_API_URL "${DAIKON_API_URL:-}"
  cat > "$html/config.js" <<EOF
window.__DAIKON_CONFIG__ = {
  oidcAuthority: "$DAIKON_OIDC_AUTHORITY",
  oidcClientId: "$DAIKON_OIDC_CLIENT_ID",
  oidcScope: "$DAIKON_OIDC_SCOPE",
  apiUrl: "${DAIKON_API_URL:-}",
};
EOF
  echo "daikon-config: wrote $html/config.js"
elif [ ! -f "$html/config.js" ]; then
  echo "daikon-config: no DAIKON_OIDC_* settings and no mounted config.js; the app will show a setup message" >&2
fi

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
