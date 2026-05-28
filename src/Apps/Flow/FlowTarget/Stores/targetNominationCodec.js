// Lightweight obfuscation for the offline Targets-of-Interest fallback data.
// XOR-with-fixed-key + base64. This deters casual repo/source reading only —
// it is NOT real security, since the key below ships in the bundle and anyone
// determined can recover the plaintext. Edit the data via scripts/nominations.mjs.
//
// Works in both the browser (Vite) and Node (the CLI) — btoa/atob/TextEncoder/
// TextDecoder are globals in both environments.

const KEY = "DAIKON-TOI-v1";
const keyBytes = new TextEncoder().encode(KEY);

const xor = (bytes) => {
  const out = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    out[i] = bytes[i] ^ keyBytes[i % keyBytes.length];
  }
  return out;
};

const bytesToBase64 = (bytes) => {
  let binary = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
  }
  return btoa(binary);
};

const base64ToBytes = (b64) => {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
};

export const encode = (obj) =>
  bytesToBase64(xor(new TextEncoder().encode(JSON.stringify(obj))));

export const decode = (blob) =>
  JSON.parse(new TextDecoder().decode(xor(base64ToBytes(blob))));
