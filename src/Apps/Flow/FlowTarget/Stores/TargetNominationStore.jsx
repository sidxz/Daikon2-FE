import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import TargetNominationAPI from "../api/TargetNominationAPI";
import { decode } from "./targetNominationCodec";
import { ENCODED_NOMINATIONS } from "./targetNominationData.encoded";

// Offline fallback data for the Targets-of-Interest view, used only when the
// backend nomination endpoints are unavailable. It is stored obfuscated
// (XOR + base64) so the target list / tiers aren't plaintext in the repo — this
// is casual-reader deterrence, not security. Edit via scripts/nominations.mjs.
//
// Decoded shape:
//   cohorts:    string[]                          ordered timeline of review cohorts
//   cohortMeta: { [cohort]: { date, author } }    per-cohort defaults for events
//   targets:    { name, pathway, events[] }[]     events = [{ type, cohort }], chronological
//   tiers:      { [cohort]: { [lcName]: 1|2|3 } } 1 = Top 4, 2 = Top 12, 3 = Top 25
const FALLBACK = decode(ENCODED_NOMINATIONS);
const MOCK_COHORTS = FALLBACK.cohorts;
const COHORT_META = FALLBACK.cohortMeta;
const COHORT_TIERS = FALLBACK.tiers;
const FALLBACK_TARGETS = FALLBACK.targets;
const DEFAULT_REASONS = FALLBACK.defaultReasons ?? {};

// Default activity-log text per event type (a stored event may override via reason).
const defaultReason = (type, cohort) => {
  if (type === "retained") return DEFAULT_REASONS.retained ?? "";
  if (type === "nominated") {
    return MOCK_COHORTS.indexOf(cohort) === 0
      ? DEFAULT_REASONS.founding ?? ""
      : DEFAULT_REASONS.nominated ?? "";
  }
  return "";
};

// Expand a compact stored event into the full shape the UI / status logic expect.
const expandEvent = (event) => ({
  type: event.type,
  cohort: event.cohort,
  date: event.date ?? COHORT_META[event.cohort]?.date ?? "",
  reason: event.reason ?? defaultReason(event.type, event.cohort),
  author: event.author ?? COHORT_META[event.cohort]?.author ?? "",
});

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
        this.nominations = data;
      });
    } catch {
      // Build nominations from the obfuscated fallback data. For each target,
      // try to match a real target in targetStore (case-insensitive); if not
      // found, use a placeholder id so the chip still renders.
      runInAction(() => {
        const realTargets = this.rootStore.targetStore.targetList;
        const realByName = {};
        realTargets.forEach((t) => {
          if (t.name) realByName[t.name.toLowerCase()] = t;
        });

        this.nominations = FALLBACK_TARGETS.map((target) => {
          const real = realByName[target.name.toLowerCase()];
          return {
            id: real?.id ?? `mock-${target.name.toLowerCase()}`,
            name: target.name,
            fullName: real?.fullName ?? "",
            pathway: target.pathway,
            events: target.events.map(expandEvent),
          };
        });
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
      (e) => this.cohorts.indexOf(e.cohort) <= cohortIndex,
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
    const statusPrev = prevCohort
      ? this._getStatusAtCohort(target, prevCohort)
      : null;

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
    const tierMap = COHORT_TIERS[this.selectedCohort] ?? {};
    return this.nominations
      .map((target) => ({
        ...target,
        deltaType: this._getDeltaAtCohort(target, this.selectedCohort),
        tier: tierMap[target.name?.toLowerCase()] ?? null,
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
