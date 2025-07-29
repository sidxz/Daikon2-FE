import { stringify } from "uuid";

/**
 * Decodes a .NET GUID stored in MongoDB's Binary format (subtype "03").
 * MongoDB stores .NET GUIDs in little-endian byte order for the first 3 sections.
 *
 * @param {Object} binaryField - Object with .base64 and .subType (should be "03").
 * @returns {string|null} - Decoded GUID string or null if invalid.
 *
 * @throws {TypeError} If input is invalid or malformed.
 */
export function decodeDotNetMongoGuid(binaryField) {
  /* Validate input structure and types */
  if (
    !binaryField ||
    typeof binaryField !== "object" ||
    binaryField.subType !== "03" ||
    typeof binaryField.base64 !== "string"
  ) {
    return null;
  }

  try {
    const decoded = atob(binaryField.base64);
    if (decoded.length !== 16) {
      console.warn(
        `Invalid GUID binary length: expected 16, got ${decoded.length}`
      );
      return null;
    }

    /* Convert base64 string to Uint8Array */
    const rawBytes = Uint8Array.from(decoded, (char) => char.charCodeAt(0));

    /* Reorder bytes from little-endian to standard GUID format */
    const reordered = new Uint8Array(16);

    // First 4 bytes [0-3] reversed
    reordered.set([rawBytes[3], rawBytes[2], rawBytes[1], rawBytes[0]], 0);

    // Next 2 bytes [4-5] reversed
    reordered.set([rawBytes[5], rawBytes[4]], 4);

    // Next 2 bytes [6-7] reversed
    reordered.set([rawBytes[7], rawBytes[6]], 6);

    // Remaining bytes [8-15] unchanged
    reordered.set(rawBytes.subarray(8, 16), 8);

    return stringify(reordered);
  } catch (error) {
    console.error("Failed to decode .NET MongoDB GUID:", error);
    return null;
  }
}
