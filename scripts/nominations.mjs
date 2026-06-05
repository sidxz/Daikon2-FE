#!/usr/bin/env node
// Round-trip editor for the obfuscated Targets-of-Interest fallback data.
//
// The plaintext never lives in the repo — only the encoded blob in
// src/Apps/Flow/FlowTarget/Stores/targetNominationData.encoded.js is committed.
// To edit (e.g. add a new cohort / targets):
//
//   node scripts/nominations.mjs decode > /tmp/nominations.json
//   $EDITOR /tmp/nominations.json
//   node scripts/nominations.mjs encode < /tmp/nominations.json
//
// Then commit the regenerated .encoded.js.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import {
  encode,
  decode,
} from "../src/Apps/Flow/FlowTarget/Stores/targetNominationCodec.js";

const here = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = resolve(
  here,
  "../src/Apps/Flow/FlowTarget/Stores/targetNominationData.encoded.js",
);

const BLOB_RE = /"([A-Za-z0-9+/=]+)"/;

const readBlob = () => {
  const src = readFileSync(DATA_FILE, "utf8");
  const match = src.match(BLOB_RE);
  if (!match) throw new Error(`No encoded blob found in ${DATA_FILE}`);
  return match[1];
};

const writeBlob = (blob) => {
  const banner =
    "// AUTO-GENERATED — do not edit by hand.\n" +
    "// Obfuscated Targets-of-Interest fallback data (XOR + base64).\n" +
    "// Edit with: node scripts/nominations.mjs decode|encode\n";
  writeFileSync(
    DATA_FILE,
    `${banner}export const ENCODED_NOMINATIONS =\n  "${blob}";\n`,
  );
};

const readStdin = () =>
  new Promise((res, rej) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => res(data));
    process.stdin.on("error", rej);
  });

const cmd = process.argv[2];

if (cmd === "decode") {
  process.stdout.write(`${JSON.stringify(decode(readBlob()), null, 2)}\n`);
} else if (cmd === "encode") {
  const obj = JSON.parse(await readStdin());
  writeBlob(encode(obj));
  process.stderr.write(`Wrote encoded blob to ${DATA_FILE}\n`);
} else {
  process.stderr.write(
    "Usage: node scripts/nominations.mjs <decode|encode>\n" +
      "  decode              print current data as JSON to stdout\n" +
      "  encode < file.json  re-encode JSON from stdin into the blob file\n",
  );
  process.exit(1);
}
