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
      isHaListCacheValid: observable,

      fetchHa: action,
      isFetchingHa: observable,
      haRegistry: observable,
      isHaRegistryCacheValid: observable,
      selectedHa: observable,

      isUpdatingHa: observable,
      updateHa: action,

      isAddingHa: observable,
      addHa: action,

      isDeletingHa: observable,
      deleteHa: action,
    });
  }

  // Observables
  isFetchingHAs = false;
  isHaListCacheValid = false;
  haListRegistry = new Map();

  isFetchingHa = false;
  haRegistry = new Map();
  isHaRegistryCacheValid = false;
  selectedHa = null;

  isUpdatingHa = false;
  isAddingHa = false;
  isDeletingHa = false;

  // Actions

  fetchHAs = async (inValidateCache = false) => {
    if (inValidateCache) {
      this.isHaListCacheValid = false;
    }
    if (this.isHaListCacheValid) {
      return;
    }
    this.isFetchingHAs = true;
    try {
      const has = await HitAssessmentAPI.list();
      runInAction(() => {
        has.forEach((ha) => {
          this.haListRegistry.set(ha.id, ha);
        });
        this.isHaListCacheValid = true;
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

  fetchHa = async (haId, inValidateCache = false) => {
    console.log("fetchHa -> haId", haId);
    if (inValidateCache) {
      this.isHaRegistryCacheValid = false;
    }

    this.isFetchingHa = true;
    if (this.isHaRegistryCacheValid) {
      // find ha in registry and return if found
      const ha = this.haRegistry.get(haId);
      if (ha) {
        this.isFetchingHa = false;
        this.selectedHa = ha;
      }
    }

    try {
      const ha = await HitAssessmentAPI.getById(haId);
      runInAction(() => {
        this.haRegistry.set(ha.id, ha);
        this.isHaRegistryCacheValid = true;
        this.selectedHa = ha;
      });
    } catch (error) {
      console.error("Error fetching ha:", error);
    } finally {
      runInAction(() => {
        this.isFetchingHa = false;
      });
    }
  };

  addHa = async (ha) => {
    this.isAddingHa = true;
    try {
      var res = await HitAssessmentAPI.create(ha);
      runInAction(() => {
        // Add ha to ha list
        ha.id = res.id;
        this.haRegistry.set(ha.id, ha);
        this.haListRegistry.set(ha.id, ha);
        this.selectedHa = ha;
        toast.success("HA added successfully");
      });
    } catch (error) {
      console.error("Error adding ha:", error);
    } finally {
      runInAction(() => {
        this.isAddingHa = false;
      });
    }
  };

  updateHa = async (ha) => {
    this.isUpdatingHa = true;

    try {
      await HitAssessmentAPI.update(ha);
      runInAction(() => {
        // update in ha registry list
        this.haRegistry.set(ha.id, ha);
        this.haListRegistry.set(ha.id, ha);
        this.selectedHa = ha;
        toast.success("HA updated successfully");
      });
    } catch (error) {
      console.error("Error updating ha:", error);
    } finally {
      runInAction(() => {
        this.isUpdatingHa = false;
      });
    }
  };

  deleteHa = async (haId) => {
    this.isDeletingHa = true;

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
        this.isDeletingHa = false;
      });
    }
  };
}
