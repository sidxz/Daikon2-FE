import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { toast } from "react-toastify";
import HitAssessmentAPI from "../api/HitAssessmentAPI";

export default class HAStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      haList: computed,
      isFetchingHAs: observable,
      fetchHAs: action,
      haListRegistry: observable,
      isHAListCacheValid: observable,

      fetchHA: action,
      isFetchingHA: observable,
      haRegistry: observable,
      isHARegistryCacheValid: observable,
      selectedHA: observable,

      isUpdatingHA: observable,
      updateHA: action,

      isAddingHA: observable,
      addHA: action,

      isDeletingHA: observable,
      deleteHA: action,
    });
  }

  // Observables
  isFetchingHAs = false;
  isHAListCacheValid = false;
  haListRegistry = new Map();

  isFetchingHA = false;
  haRegistry = new Map();
  isHARegistryCacheValid = false;
  selectedHA = null;

  isUpdatingHA = false;
  isAddingHA = false;
  isDeletingHA = false;

  // Actions

  fetchHAs = async (inValidateCache = false) => {
    if (inValidateCache) {
      this.isHAListCacheValid = false;
    }
    if (this.isHAListCacheValid) {
      return;
    }
    this.isFetchingHAs = true;
    try {
      const has = await HitAssessmentAPI.list();
      runInAction(() => {
        has.forEach((ha) => {
          this.haListRegistry.set(ha.id, ha);
        });
        this.isHAListCacheValid = true;
      });
    } catch (error) {
      console.error("Error fetching HAs", error);
    } finally {
      runInAction(() => {
        this.isFetchingHAs = false;
      });
    }
  };

  get haList() {
    return Array.from(this.haListRegistry.values());
  }

  fetchHA = async (haId, inValidateCache = false) => {
    console.log("fetchHA -> haId", haId);
    if (inValidateCache) {
      this.isHARegistryCacheValid = false;
    }

    this.isFetchingHA = true;
    if (this.isHARegistryCacheValid) {
      // find ha in registry and return if found
      const ha = this.haRegistry.get(haId);
      if (ha) {
        this.isFetchingHA = false;
        this.selectedHA = ha;
      }
    }

    try {
      const ha = await HitAssessmentAPI.getById(haId);
      runInAction(() => {
        this.haRegistry.set(ha.id, ha);
        this.isHARegistryCacheValid = true;
        this.selectedHA = ha;
      });
    } catch (error) {
      console.error("Error fetching ha:", error);
    } finally {
      runInAction(() => {
        this.isFetchingHA = false;
      });
    }
  };

  addHA = async (ha) => {
    this.isAddingHA = true;

    try {
      var res = await HitAssessmentAPI.create(ha);
      runInAction(() => {
        // Add ha to ha list

        ha.id = res.id;
        this.haRegistry.set(ha.id, ha);
        this.haListRegistry.set(ha.id, ha);
        toast.success("HA added successfully");
      });
    } catch (error) {
      console.error("Error adding ha:", error);
    } finally {
      runInAction(() => {
        this.isAddingHA = false;
      });
    }
  };

  updateHA = async (ha) => {
    this.isUpdatingHA = true;

    try {
      await HitAssessmentAPI.update(ha);
      runInAction(() => {
        // update in ha registry list
        this.haRegistry.set(ha.id, ha);
        this.haListRegistry.set(ha.id, ha);
        this.selectedHA = ha;
        toast.success("HA updated successfully");
      });
    } catch (error) {
      console.error("Error updating ha:", error);
    } finally {
      runInAction(() => {
        this.isUpdatingHA = false;
      });
    }
  };

  deleteHA = async (haId) => {
    this.isDeletingHA = true;

    // Ensure haId is not null, undefined, or empty
    if (!haId?.trim()) {
      throw new Error("haId is required and cannot be empty.");
    }

    try {
      await HitAssessmentAPI.delete(haId, haId);
      runInAction(() => {
        // remove ha from ha list
        this.haRegistry.delete(haId);
        this.haListRegistry.delete(haId);
        toast.success("HA deleted successfully");
      });
    } catch (error) {
      console.error("Error deleting ha:", error);
    } finally {
      runInAction(() => {
        this.isDeletingHA = false;
      });
    }
  };
}
