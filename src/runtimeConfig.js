// Deployment settings, read at page load from /config.js (window.__DAIKON_CONFIG__),
// so one image serves any deployment. The container writes /config.js from DAIKON_*
// env vars at start (docker/40-daikon-config.sh); in dev it is public/config.js.
const config = window.__DAIKON_CONFIG__ ?? {};

export const isConfigured = Boolean(
  config.oidcAuthority && config.oidcClientId && config.oidcScope
);

export const OIDCConfig = {
  authority: config.oidcAuthority,
  client_id: config.oidcClientId,
  scope: config.oidcScope,
  redirect_uri: window.location.origin + "/auth/signin_redirect",
  response_type: "code",
  response_mode: "query",
  post_logout_redirect_uri: window.location.origin + "/auth/signout_redirect",
  automaticSilentRenew: true,
  silent_redirect_uri: window.location.origin + "/auth/silent_redirect",
};

export const AxiosConfig = {
  // Default: the API on this origin under /api, forwarded to the gateway by nginx
  // (DAIKON_API_UPSTREAM), the ingress, or the vite dev server
  baseURL: (config.apiUrl || "/api").replace(/\/+$/, ""),
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};
