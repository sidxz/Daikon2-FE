import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import TargetNominationAPI from "../api/TargetNominationAPI";

// Hard-coded pathway map derived from the Nov 2024 semi-annual meeting slide.
// "retained" = Top 25 (Nov 2023), still active.
// "nominated" = newly added at Nov 2024.
// Target names are matched case-insensitively against the real targetStore.

const MOCK_COHORTS = ["Nov 2023", "Nov 2024"];

const PATHWAY_TARGET_MAP = [
  {
    pathway: "Amino acid biosynthesis",
    retained: ["ArgB", "AroG", "DapE", "LysA"],
    nominated: ["MetA", "DapA", "Asd"],
  },
  {
    pathway: "Arabinogalactan biosynthesis",
    retained: ["GlfT2", "UbiA"],
    nominated: ["Glf", "AftB", "DprE1"],
  },
  {
    pathway: "Cell division",
    retained: ["FtsZ", "MtrA"],
    nominated: ["FtsK", "FtsW", "FtsQ"],
  },
  {
    pathway: "DNA repair & replication",
    retained: ["DnaN"],
    nominated: ["DnaB"],
  },
  {
    pathway: "Fatty acid catabolism",
    retained: ["EtfD"],
    nominated: [],
  },
  {
    pathway: "Folate biosynthesis",
    retained: ["FolE"],
    nominated: [],
  },
  {
    pathway: "Glyoxylate shunt / TCA cycle",
    retained: ["GlcB", "Mdh"],
    nominated: [],
  },
  {
    pathway: "Isoprenoid biosynthesis",
    retained: ["Dxs1"],
    nominated: [],
  },
  {
    pathway: "NAD(P) biosynthesis",
    retained: ["NadE", "NadD"],
    nominated: [],
  },
  {
    pathway: "Peptidoglycan biosynthesis",
    retained: ["MurA", "MurX"],
    nominated: ["MurG", "MurC"],
  },
  {
    pathway: "Protein secretion",
    retained: ["SecA1", "SecE1"],
    nominated: ["SecY"],
  },
  {
    pathway: "Riboflavin biosynthesis",
    retained: ["RibF"],
    nominated: ["RibA2"],
  },
  {
    pathway: "tRNA biosynthesis",
    retained: ["MetS", "PheRS"],
    nominated: ["AlaS", "GlyS"],
  },
];

// Hardcoded until the backend returns isPriority on each NominationRecord.
// Once the API is live, this set can be removed — the flag will come from the response directly.
const PRIORITY_TARGETS = new Set(["mdh", "nadd", "glcb", "dape", "secy"]);

// Build a flat lookup: normalised name → { pathway, eventType }
const _buildPathwayLookup = () => {
  const map = {};
  PATHWAY_TARGET_MAP.forEach(({ pathway, retained, nominated }) => {
    retained.forEach((n) => { map[n.toLowerCase()] = { pathway, eventType: "retained" }; });
    nominated.forEach((n) => { map[n.toLowerCase()] = { pathway, eventType: "nominated" }; });
  });
  return map;
};
const PATHWAY_LOOKUP = _buildPathwayLookup();


export default class TargetNominationStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      cohorts: observable,
      isFetchingCohorts: observable,
      fetchCohorts: action,

      selectedCohortIndex: observable,
      setSelectedCohortIndex: action,
      selectedCohort: computed,

      nominations: observable,
      isFetchingNominations: observable,
      fetchNominations: action,

      activeTargets: computed,
      removedTargets: computed,
      stats: computed,

      selectedTarget: observable,
      setSelectedTarget: action,

      targetEvents: observable,
      isFetchingTargetEvents: observable,
      fetchTargetEvents: action,

      addTargetEvent: action,
      isAddingEvent: observable,
    });
  }

  cohorts = [];
  isFetchingCohorts = false;

  selectedCohortIndex = 0;

  nominations = [];
  isFetchingNominations = false;

  selectedTarget = null;

  targetEvents = [];
  isFetchingTargetEvents = false;

  isAddingEvent = false;

  get selectedCohort() {
    return this.cohorts[this.selectedCohortIndex] ?? null;
  }

  setSelectedCohortIndex = (index) => {
    runInAction(() => {
      this.selectedCohortIndex = index;
      this.selectedTarget = null;
    });
  };

  setSelectedTarget = (target) => {
    runInAction(() => {
      this.selectedTarget = target;
    });
    if (target) {
      this.fetchTargetEvents(target.id);
      this.rootStore.horizonStore.fetchHorizon(target.id);
    }
  };

  fetchCohorts = async () => {
    if (this.isFetchingCohorts) return;
    this.isFetchingCohorts = true;
    try {
      const data = await TargetNominationAPI.getCohorts();
      runInAction(() => {
        this.cohorts = data;
        this.selectedCohortIndex = data.length - 1;
      });
    } catch {
      // Use mock data when API is unavailable
      runInAction(() => {
        this.cohorts = MOCK_COHORTS;
        this.selectedCohortIndex = MOCK_COHORTS.length - 1;
      });
    } finally {
      runInAction(() => {
        this.isFetchingCohorts = false;
      });
    }
  };

  fetchNominations = async (cohort) => {
    if (this.isFetchingNominations) return;
    this.isFetchingNominations = true;
    try {
      const data = await TargetNominationAPI.getNominationsByCohort(cohort);
      runInAction(() => {
        this.nominations = data.map((t) => ({
          ...t,
          isPriority: PRIORITY_TARGETS.has(t.name?.toLowerCase()),
        }));
      });
    } catch {
      // Build nominations from PATHWAY_TARGET_MAP as source of truth.
      // For each hardcoded target name, try to find a real target in targetStore
      // (case-insensitive). If not found, use the name itself as a placeholder id.
      runInAction(() => {
        const realTargets = this.rootStore.targetStore.targetList;
        const realByName = {};
        realTargets.forEach((t) => {
          if (t.name) realByName[t.name.toLowerCase()] = t;
        });

        const nominations = [];

        PATHWAY_TARGET_MAP.forEach(({ pathway, retained, nominated }) => {
          retained.forEach((name) => {
            const real = realByName[name.toLowerCase()];
            if (!real) return;
            nominations.push({
              id: real.id,
              name,
              fullName: real?.fullName ?? "",
              pathway,
              isPriority: PRIORITY_TARGETS.has(name.toLowerCase()),
              events: [
                {
                  type: "nominated",
                  cohort: "Nov 2023",
                  date: "2023-11-06",
                  reason: "Added at semi-annual review.",
                  author: "Consortium review",
                },
                {
                  type: "retained",
                  cohort: "Nov 2024",
                  date: "2024-11-06",
                  reason: "Retained at semi-annual review.",
                  author: "Consortium review",
                },
              ],
            });
          });

          nominated.forEach((name) => {
            const real = realByName[name.toLowerCase()];
            if (!real) return;
            nominations.push({
              id: real.id,
              name,
              fullName: real?.fullName ?? "",
              pathway,
              isPriority: PRIORITY_TARGETS.has(name.toLowerCase()),
              events: [
                {
                  type: "nominated",
                  cohort: "Nov 2024",
                  date: "2024-11-06",
                  reason: "Newly added at semi-annual review.",
                  author: "Consortium review",
                },
              ],
            });
          });
        });

        this.nominations = nominations;
      });
    } finally {
      runInAction(() => {
        this.isFetchingNominations = false;
      });
    }
  };

  /**
   * Determines target status at a given cohort.
   * Returns "active" | "inactive" | null
   */
  _getStatusAtCohort = (target, cohort) => {
    const cohortIndex = this.cohorts.indexOf(cohort);
    const eligibleEvents = target.events.filter(
      (e) => this.cohorts.indexOf(e.cohort) <= cohortIndex
    );
    if (!eligibleEvents.length) return null;
    const lastEvent = eligibleEvents[eligibleEvents.length - 1];
    return lastEvent.type === "removed" ? "inactive" : "active";
  };

  /**
   * Determines delta type at the selected cohort vs previous.
   * Returns "nominated" | "retained" | "removed" | null
   */
  _getDeltaAtCohort = (target, cohort) => {
    const cohortIndex = this.cohorts.indexOf(cohort);
    const isFirst = cohortIndex === 0;
    const prevCohort = isFirst ? null : this.cohorts[cohortIndex - 1];

    const eventAtCohort = target.events.find((e) => e.cohort === cohort);
    const statusNow = this._getStatusAtCohort(target, cohort);
    const statusPrev = prevCohort ? this._getStatusAtCohort(target, prevCohort) : null;

    if (statusNow === null) return null;

    if (statusNow === "inactive") {
      // Only show as removed if they were active before
      if (statusPrev === "active") return "removed";
      return null;
    }

    // Active now
    if (isFirst) {
      // Founding cohort — all targets were newly nominated at this point
      return "nominated";
    }
    if (statusPrev === null) {
      // Target didn't exist in the previous cohort — it's newly entering now
      return eventAtCohort?.type === "nominated" ? "nominated" : "retained";
    }
    if (eventAtCohort?.type === "nominated") return "nominated";
    return "retained";
  };

  get activeTargets() {
    if (!this.selectedCohort || !this.nominations.length) return [];
    return this.nominations
      .map((target) => ({
        ...target,
        deltaType: this._getDeltaAtCohort(target, this.selectedCohort),
      }))
      .filter((t) => t.deltaType === "nominated" || t.deltaType === "retained");
  }

  get removedTargets() {
    if (!this.selectedCohort || !this.nominations.length) return [];
    return this.nominations
      .map((target) => ({
        ...target,
        deltaType: this._getDeltaAtCohort(target, this.selectedCohort),
      }))
      .filter((t) => t.deltaType === "removed");
  }

  get stats() {
    const active = this.activeTargets;
    const removed = this.removedTargets;
    const nominated = active.filter((t) => t.deltaType === "nominated").length;
    const retained = active.filter((t) => t.deltaType === "retained").length;
    return {
      total: active.length,
      nominated,
      retained,
      removed: removed.length,
    };
  }

  fetchTargetEvents = async (targetId) => {
    if (this.isFetchingTargetEvents) return;
    this.isFetchingTargetEvents = true;
    try {
      const data = await TargetNominationAPI.getTargetEvents(targetId);
      runInAction(() => {
        this.targetEvents = data;
      });
    } catch {
      // Use mock events from nominations
      const target = this.nominations.find((t) => t.id === targetId);
      runInAction(() => {
        this.targetEvents = target ? [...target.events].reverse() : [];
      });
    } finally {
      runInAction(() => {
        this.isFetchingTargetEvents = false;
      });
    }
  };

  addTargetEvent = async (targetId, event) => {
    this.isAddingEvent = true;
    const newEvent = {
      ...event,
      cohort: this.selectedCohort,
      date: new Date().toISOString().split("T")[0],
    };
    const applyEvent = () => {
      const idx = this.nominations.findIndex((t) => t.id === targetId);
      if (idx !== -1) {
        // Replace the array reference so MobX computed values recompute
        const updated = { ...this.nominations[idx] };
        updated.events = [...updated.events, newEvent];
        this.nominations = [
          ...this.nominations.slice(0, idx),
          updated,
          ...this.nominations.slice(idx + 1),
        ];
      }
      this.targetEvents = [newEvent, ...this.targetEvents];
    };
    try {
      await TargetNominationAPI.addTargetEvent(targetId, event);
      runInAction(applyEvent);
    } catch {
      // Optimistic update when API is unavailable (mock mode)
      runInAction(applyEvent);
    } finally {
      runInAction(() => {
        this.isAddingEvent = false;
      });
    }
  };
}
