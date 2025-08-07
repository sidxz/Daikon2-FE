/**
 * Count the number of meaningful revisions for a specific field,
 * ignoring entries where the field's value hasn't changed.
 *
 * @param {Array<Object>} revisions - List of revision objects containing field changes.
 * @param {string} fieldName - The name of the field to track (e.g., "shortSummary").
 * @returns {number} - The count of meaningful changes for the specified field.
 *
 * @throws {TypeError} If input types are invalid.
 */
export const countMeaningfulRevisions = (revisions, fieldName) => {
  /* Validate inputs to ensure robust and secure usage */
  if (!Array.isArray(revisions)) {
    throw new TypeError("Expected 'revisions' to be an array.");
  }

  if (typeof fieldName !== "string" || fieldName.trim() === "") {
    throw new TypeError("Expected 'fieldName' to be a non-empty string.");
  }

  /* Early exit if there are no revisions to evaluate */
  if (revisions.length === 0) {
    return 0;
  }

  let meaningfulChangeCount = 0;
  let lastSeenValue;
  let isFirst = true;

  for (const revision of revisions) {
    // Safely extract the current value or fallback to empty string
    const currentValue =
      revision && fieldName in revision ? revision[fieldName] : "";

    // On first iteration, always count the value
    if (isFirst) {
      meaningfulChangeCount++;
      lastSeenValue = currentValue;
      isFirst = false;
      continue;
    }

    // Count only if the field value has changed
    if (currentValue !== lastSeenValue) {
      meaningfulChangeCount++;
      lastSeenValue = currentValue;
    }
  }

  return meaningfulChangeCount;
};
