export const FDateFormatted = (timestamp, hideTime = true) => {
  // Check if timestamp is null, undefined, or the default date
  if (
    !timestamp ||
    timestamp === "0001-01-01T00:00:00" ||
    timestamp === "0001-01-01T00:00:00Z"
  ) {
    return "";
  }

  // Format the date based on hideTime flag
  if (hideTime) {
    return new Date(timestamp).toLocaleDateString();
  }

  return new Date(timestamp).toLocaleString();
};
