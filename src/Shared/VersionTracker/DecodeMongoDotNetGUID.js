import { stringify } from "uuid";

/**
 * Decodes a .NET GUID stored in MongoDB's Binary format (subtype 03).
 * MongoDB uses little-endian layout for .NET GUIDs.
 * @param {Object} binaryField - e.g., { base64: "...", subType: "03" }
 * @returns {string|null}
 */
export function decodeDotNetMongoGuid(binaryField) {
  if (
    !binaryField ||
    typeof binaryField !== "object" ||
    binaryField.subType !== "03" ||
    typeof binaryField.base64 !== "string"
  ) {
    return null;
  }

  try {
    const binary = atob(binaryField.base64);
    if (binary.length !== 16) {
      console.warn("Invalid GUID length:", binary.length);
      return null;
    }

    const raw = new Uint8Array(16);
    for (let i = 0; i < 16; i++) {
      raw[i] = binary.charCodeAt(i);
    }

    // Swap byte order for .NET GUID (first 4 + 2 + 2 bytes need to be reversed)
    const reordered = new Uint8Array(16);

    // Swap bytes: [0-3] reversed
    reordered[0] = raw[3];
    reordered[1] = raw[2];
    reordered[2] = raw[1];
    reordered[3] = raw[0];

    // Swap bytes: [4-5] reversed
    reordered[4] = raw[5];
    reordered[5] = raw[4];

    // Swap bytes: [6-7] reversed
    reordered[6] = raw[7];
    reordered[7] = raw[6];

    // Leave [8-15] as-is
    for (let i = 8; i < 16; i++) {
      reordered[i] = raw[i];
    }

    return stringify(reordered);
  } catch (err) {
    console.error("Failed to decode .NET MongoDB GUID:", err);
    return null;
  }
}
