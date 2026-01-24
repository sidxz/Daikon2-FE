// -----------------------------
// 1) helpers/urlSeed.js
// -----------------------------
export function base64UrlEncodeUtf8(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  const b64 = btoa(binary);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function base64UrlDecodeUtf8(b64url) {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 ? "=".repeat(4 - (b64.length % 4)) : "";
  const binary = atob(b64 + pad);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function buildSeedParam(obj) {
  return base64UrlEncodeUtf8(JSON.stringify(obj));
}

export function parseSeedParam(seed) {
  const json = base64UrlDecodeUtf8(seed);
  return JSON.parse(json);
}
