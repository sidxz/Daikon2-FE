export const statusMeta = (status) => {
  switch (status) {
    case "DUPLICATE_DISCLOSED":
      return {
        label: "Duplicate Disclosed",
        severity: "warning",
        color: "var(--orange-500)",
      };
    case "DUPLICATE_UNDISCLOSED":
      return {
        label: "Duplicate Undisclosed",
        severity: "warning",
        color: "var(--orange-500)",
      };
    case "DISCLOSURE":
      return {
        label: "Disclosure",
        severity: "success",
        color: "var(--green-500)",
      };
    case "REGISTRATION":
      return {
        label: "Registration with Disclosure",
        severity: "success",
        color: "var(--green-500)",
      };
    case "REGISTER_UNDISCLOSED":
      return {
        label: "Register Undisclosed",
        severity: "success",
        color: "var(--green-500)",
      };
    default:
      return {
        label: status || "UNKNOWN",
        severity: "info",
        color: "var(--blue-500)",
      };
  }
};
export const normalizeName = (name) =>
  (name ?? "").toString().trim().toLowerCase().replace(/\s+/g, " "); // collapse whitespace

export const parseSynonyms = (synonyms) => {
  if (!synonyms) return [];
  // "a, b, c" -> ["a","b","c"]
  return synonyms
    .toString()
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

export const buildReturnedNameSet = (results = []) => {
  const set = new Set();

  for (const r of results || []) {
    const primary = normalizeName(r?.name);
    if (primary) set.add(primary);

    const syns = parseSynonyms(r?.synonyms);
    for (const s of syns) {
      const key = normalizeName(s);
      if (key) set.add(key);
    }
  }

  return set;
};

// Returns: rows sent to server but NOT returned in preview (by name OR synonym match)
export const computeRejectedByNameOrSynonym = (inputs = [], results = []) => {
  const returnedNameSet = buildReturnedNameSet(results);

  return (inputs || []).filter((inp) => {
    const key = normalizeName(inp?.name);
    if (!key) return true; // missing input name => treat as rejected
    return !returnedNameSet.has(key);
  });
};
