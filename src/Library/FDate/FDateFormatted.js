/**
 * Formats a timestamp into a human-readable date or date-time string.
 * Returns an empty string for null, undefined, or default dates.
 *
 * @param {string|Date} timestamp - The timestamp to format.
 * @param {boolean} hideTime - If true, returns only the date part.
 * @returns {string} - Formatted date or empty string for invalid/default dates.
 */
export const FDateFormatted = (timestamp, hideTime = true) => {
  if (!timestamp) return "";

  try {
    const date = new Date(timestamp);

    // Handle invalid date
    if (isNaN(date.getTime())) return "";

    // Extract the ISO date portion and compare only the date
    const isoDatePart = date.toISOString().split("T")[0];

    if (isoDatePart === "0001-01-01") {
      return "";
    }

    return hideTime ? date.toLocaleDateString() : date.toLocaleString();
  } catch {
    return "";
  }
};

/**
 * Converts a date-like value to ISO string without milliseconds.
 * Returns "0001-01-01T00:00:00" for invalid or null values.
 */
export function FDateISOString(value) {
  const FALLBACK_DATE = "0001-01-01T00:00:00";

  try {
    if (!value) return FALLBACK_DATE;

    // If already fallback, avoid re-parsing
    if (
      value === FALLBACK_DATE ||
      value === FALLBACK_DATE + "Z" ||
      value === "0001-01-01T00:00:00.000Z"
    ) {
      return FALLBACK_DATE;
    }

    let date;

    if (typeof value === "number") {
      const excelEpoch = new Date(Date.UTC(1900, 0, 1));
      date = new Date(excelEpoch.getTime() + (value - 2) * 86400000);
    } else if (typeof value === "string") {
      const normalizedValue = value.trim().replace(/\//g, "-");
      date = new Date(normalizedValue);
    } else if (value instanceof Date) {
      date = value;
    } else {
      return FALLBACK_DATE;
    }

    if (isNaN(date.getTime())) {
      return FALLBACK_DATE;
    }

    // Format manually to remove milliseconds
    const pad = (num) => String(num).padStart(2, "0");

    return (
      date.getUTCFullYear() +
      "-" +
      pad(date.getUTCMonth() + 1) +
      "-" +
      pad(date.getUTCDate()) +
      "T" +
      pad(date.getUTCHours()) +
      ":" +
      pad(date.getUTCMinutes()) +
      ":" +
      pad(date.getUTCSeconds()) +
      "Z"
    );
  } catch {
    return FALLBACK_DATE;
  }
}
