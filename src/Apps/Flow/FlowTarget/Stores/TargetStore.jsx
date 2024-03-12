import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { toast } from "react-toastify";
import TargetAPI from "../api/TargetAPI";

export default class TargetStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      targetList: computed,
      isFetchingTargets: observable,
      fetchTargets: action,
      targetListRegistry: observable,
      isTargetListCacheValid: observable,

      fetchTarget: action,
      isFetchingTarget: observable,
      targetRegistry: observable,
      isTargetRegistryCacheValid: observable,
      selectedTarget: observable,

      isUpdatingTarget: observable,
      updateTarget: action,

      isAddingTarget: observable,
      addTarget: action,

      isDeletingTarget: observable,
      deleteTarget: action,
    });
  }

  // Observables
  isFetchingTargets = false;
  isTargetListCacheValid = false;
  targetListRegistry = new Map();

  isFetchingTarget = false;
  targetRegistry = new Map();
  isTargetRegistryCacheValid = false;
  selectedTarget = null;

  isUpdatingTarget = false;
  isAddingTarget = false;
  isDeletingTarget = false;

  // Actions

  fetchTargets = async (inValidateCache = false) => {
    if (inValidateCache) {
      this.isTargetListCacheValid = false;
    }
    if (this.isTargetListCacheValid) {
      return;
    }
    this.isFetchingTargets = true;
    try {
      const targets = await TargetAPI.list();
      runInAction(() => {
        targets.forEach((target) => {
          this.targetListRegistry.set(target.id, target);
        });
        this.isTargetListCacheValid = true;
      });
    } catch (error) {
      console.error("Error fetching targets:", error);
    } finally {
      runInAction(() => {
        this.isFetchingTargets = false;
      });
    }
  };

  get targetList() {
    return Array.from(this.targetListRegistry.values());
  }

  fetchTarget = async (targetId, inValidateCache = false) => {
    if (inValidateCache) {
      this.isTargetRegistryCacheValid = false;
    }

    this.isFetchingTarget = true;

    if (this.isTargetRegistryCacheValid) {
      // find target in registry and return if found
      const target = this.targetRegistry.get(targetId);
      console.log("fetchTarget -> target", target);

      if (target) {
        this.isFetchingTarget = false;
        this.selectedTarget = target;
      }
    }
    try {
      const target = await TargetAPI.getById(targetId);
      runInAction(() => {
        console.log("fetchTarget -> target", target);
        this.targetRegistry.set(target.id, target);
        this.isTargetRegistryCacheValid = true;
        this.selectedTarget = target;
      });
    } catch (error) {
      console.error("Error fetching target:", error);
    } finally {
      runInAction(() => {
        this.isFetchingTarget = false;
      });
    }
  };

  addTarget = async (target) => {
    this.isAddingTarget = true;

    try {
      var res = await TargetAPI.create(target);
      runInAction(() => {
        // Add target to target list
        target.id = res.id;

        this.targetRegistry.set(target.id, target);
        this.targetListRegistry.set(target.id, target);
        this.selectedTarget = target;
        toast.success("Target added successfully");
      });
    } catch (error) {
      console.error("Error adding target:", error);
    } finally {
      runInAction(() => {
        this.isAddingTarget = false;
      });
    }
  };

  updateTarget = async (target) => {
    this.isUpdatingTarget = true;

    try {
      await TargetAPI.update(target);
      runInAction(() => {
        // update in target registry list
        this.targetRegistry.set(target.id, target);
        this.targetListRegistry.set(target.id, target);
        this.selectedTarget = target;
        toast.success("Target updated successfully");
      });
    } catch (error) {
      console.error("Error updating target:", error);
    } finally {
      runInAction(() => {
        this.isUpdatingTarget = false;
      });
    }
  };

  deleteTarget = async (targetId) => {
    this.isDeletingTarget = true;

    // Ensure targetId is not null, undefined, or empty
    if (!targetId?.trim()) {
      throw new Error("targetId is required and cannot be empty.");
    }

    try {
      await TargetAPI.delete(targetId, targetId);
      runInAction(() => {
        // remove target from target list
        this.targetRegistry.delete(targetId);
        this.targetListRegistry.delete(targetId);
        this.selectedTarget = null;
        toast.success("Target deleted successfully");
      });
    } catch (error) {
      console.error("Error deleting target:", error);
    } finally {
      runInAction(() => {
        this.isDeletingTarget = false;
      });
    }
  };
}
