import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { toast } from "react-toastify";
import TargetToxicologyAPI from "../api/TargetToxicologyAPI";

// TargetSafetyAssessmentStore consumes TargetToxicologyAPI of backend

export default class TargetSafetyAssessmentStore {
  rootStore;

  toxicologyRegistry = new Map();
  isFetchingToxicologyOfTarget = false;

  isFetchingAllToxicology = false;

  constructor(rootStore) {
    this.rootStore = rootStore;

    makeObservable(this, {
      isFetchingToxicologyOfTarget: observable,
      fetchToxicologyOfTarget: action,
      isFetchingAllToxicology: observable,
      fetchAllToxicology: action,

      toxicologyRegistry: observable,
      toxicology: computed,
      toxicologyOfSelectedTarget: computed,
    });
  }

  fetchToxicologyOfTarget = async (targetId) => {
    console.log("fetchToxicologyOfTarget", targetId);

    this.isFetchingToxicologyOfTarget = true;
    try {
      const response = await TargetToxicologyAPI.getByTargetId(targetId);
      runInAction(() => {
        response.forEach((toxicology) => {
          this.toxicologyRegistry.set(toxicology.toxicologyId, toxicology);
        });
      });
    } catch (error) {
      toast.error("Failed to fetch toxicology data");
    } finally {
      runInAction(() => {
        this.isFetchingToxicologyOfTarget = false;
      });
    }
  };

  fetchAllToxicology = async () => {
    this.isFetchingAllToxicology = true;
    try {
      const response = await TargetToxicologyAPI.list();
      runInAction(() => {
        response.forEach((toxicology) => {
          this.toxicologyRegistry.set(toxicology.toxicologyId, toxicology);
        });
      });
    } catch (error) {
      toast.error("Failed to fetch toxicology data");
    } finally {
      runInAction(() => {
        this.isFetchingAllToxicology = false;
      });
    }
  };

  get toxicology() {
    return Array.from(this.toxicologyRegistry.values());
  }

  get toxicologyOfSelectedTarget() {
    return this.toxicology.filter(
      (toxicology) =>
        toxicology.targetId === this.rootStore.targetStore.selectedTarget?.id
    );
  }
}
