import { useContext } from "react";
import stringSimilarity from "string-similarity";
import { RootStoreContext } from "../../RootStore";

export const AppOrgResolver = () => {
  const rootStore = useContext(RootStoreContext);
  const { appVars } = rootStore.authStore;

  const getOrgNameById = (orgId) => {
    return appVars.orgs[orgId];
  };
  const getOrgIdByName = (orgName) => {
    return Object.keys(appVars.orgs).find(
      (key) => appVars.orgs[key] === orgName
    );
  };

  const getOrgAliasById = (orgId) => {
    return appVars.orgsAlias[orgId];
  };

  const getOrgIdByAlias = (orgAlias) => {
    return Object.keys(appVars.orgsAlias).find(
      (key) => appVars.orgsAlias[key] === orgAlias
    );
  };

  /**
   * Fuzzy match an input string to the closest org name
   * @param {string} inputName - The user-provided org name
   * @returns {{ id: string, name: string, score: number } | null}
   */
  /**
   * Resolve an input name to an org by exact or fuzzy matching
   * @param {string} inputName - The provided org name
   * @returns {{ id: string, name: string, score?: number, matchedBy: "exact" | "fuzzy" } | null}
   */
  const fuzzyMatchOrgByName = (input, threshold = 0.7) => {
    if (!input || !appVars?.orgs) return null;

    const norm = (s) => (s ?? "").toString().trim().toLowerCase();

    const orgIds = Object.keys(appVars.orgs);
    const aliases = appVars.orgsAlias || {};

    const lowerInput = norm(input);

    // ---- 1) Exact match (case-insensitive) on NAME then ALIAS ----
    // Name
    let exactId = orgIds.find((id) => norm(appVars.orgs[id]) === lowerInput);
    if (exactId) {
      return {
        id: exactId,
        name: appVars.orgs[exactId],
        alias: aliases[exactId],
        matchedBy: "exact",
        matchedField: "name",
      };
    }
    // Alias
    exactId = Object.keys(aliases).find(
      (id) => norm(aliases[id]) === lowerInput
    );
    if (exactId) {
      return {
        id: exactId,
        name: appVars.orgs[exactId],
        alias: aliases[exactId],
        matchedBy: "exact",
        matchedField: "alias",
      };
    }

    // ---- 2) Fuzzy match across NAME + ALIAS ----
    // Build candidate list with mapping back to id + field
    const candidates = [];
    const backref = new Map(); // key: candidate string, val: { id, field }

    // Names
    for (const id of orgIds) {
      const label = norm(appVars.orgs[id]);
      if (label) {
        candidates.push(label);
        // First come, first served if duplicates exist
        if (!backref.has(label)) backref.set(label, { id, field: "name" });
      }
    }

    // Aliases
    for (const id of Object.keys(aliases)) {
      const label = norm(aliases[id]);
      if (label) {
        candidates.push(label);
        if (!backref.has(label)) backref.set(label, { id, field: "alias" });
      }
    }

    if (candidates.length === 0) return null;

    const { bestMatch } = stringSimilarity.findBestMatch(
      lowerInput,
      candidates
    );

    if (bestMatch?.rating > threshold) {
      const { id, field } = backref.get(bestMatch.target) || {};
      if (!id) return null;

      return {
        id,
        name: appVars.orgs[id],
        alias: aliases[id],
        matchedBy: "fuzzy",
        matchedField: field,
        score: bestMatch.rating,
      };
    }

    return null;
  };

  return {
    getOrgNameById,
    getOrgIdByName,
    getOrgAliasById,
    getOrgIdByAlias,
    fuzzyMatchOrgByName,
  };
};
