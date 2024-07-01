export function isValidGuid(guid) {
  const guidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  const emptyGuid = "00000000-0000-0000-0000-000000000000";

  if (guid == null || guid === "" || guid === emptyGuid) {
    return false;
  }

  return guidRegex.test(guid);
}
