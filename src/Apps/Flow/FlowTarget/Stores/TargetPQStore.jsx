import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { toast } from "react-toastify";
import TPQAPI from "../api/TPQAPI";

export default class TargetPQStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      TQRegistry: observable,
      isFetchingTQList: observable,
      fetchTQUnverified: action,

      fetchTQ: action,
      isFetchingTQ: observable,

      fetchTQByTargetId: action,

      isTQCacheValid: observable,
      isTQUnVerifiedCacheValid: observable,

      selectedTQ: observable,

      updateTQ: action,
      isUpdatingTQ: observable,

      approveTQ: action,
      isApprovingTQ: observable,

      TQUnapproved: computed,
    });
  }

  // Observables
  isFetchingTQList = false;
  isTQCacheValid = false;
  isTQUnVerifiedCacheValid = false;
  TQRegistry = new Map();
  selectedTQ = null;

  isFetchingTQ = false;
  isUpdatingTQ = false;
  isApprovingTQ = false;

  // Actions
  fetchTQUnverified = async (inValidateCache = false) => {
    if (inValidateCache) {
      this.isTQUnVerifiedCacheValid = false;
    }
    if (this.isTQUnVerifiedCacheValid) {
      return;
    }
    this.isFetchingTQList = true;
    try {
      const response = await TPQAPI.listUnverified();
      runInAction(() => {
        response.forEach((tq) => {
          console.log(tq);
          this.TQRegistry.set(tq.id, tq);
        });
        this.isTQUnVerifiedCacheValid = true;
      });
    } catch (error) {
      toast.error("Error fetching target questionnaire");
    } finally {
      runInAction(() => {
        this.isFetchingTQList = false;
      });
    }
  };

  // Computed
  get targetQuestionnaires() {
    return Array.from(this.TQRegistry.values());
  }

  get TQUnapproved() {
    return this.targetQuestionnaires.filter((q) => q.isVerified === false);
  }

  fetchTQ = async (id, inValidateCache = false) => {
    if (inValidateCache) {
      this.isTQCacheValid = false;
    }

    this.isFetchingTQ = true;

    if (this.isTQCacheValid) {
      const tq = this.TQRegistry.get(id);
      console.log("fetchTQ -> tq", tq);

      if (tq) {
        this.isFetchingTQ = false;
        this.selectedTQ = tq;
      }
    }
    try {
      const tq = await TPQAPI.getById(id);
      runInAction(() => {
        console.log("fetchTQ -> tq", tq);
        this.TQRegistry.set(tq.id, tq);
        this.selectedTQ = tq;
      });
    } catch (error) {
    } finally {
      runInAction(() => {
        this.isFetchingTQ = false;
      });
    }
  };

  fetchTQByTargetId = async (targetId, inValidateCache = false) => {
    if (inValidateCache) {
      this.isTQCacheValid = false;
    }

    this.isFetchingTQ = true;

    if (this.isTQCacheValid) {
      // search registry where targetId === targetId
      const tq = Array.from(this.TQRegistry.values()).find(
        (tq) => tq.targetId === targetId
      );
      console.log("fetchTQByTargetId  -> tq", tq);

      if (tq) {
        this.isFetchingTQ = false;
        this.selectedTQ = tq;
      }
    }
    try {
      const tq = await TPQAPI.getByTargetId(targetId);
      runInAction(() => {
        console.log("fetchTQByTargetId  -> tq", tq);
        this.TQRegistry.set(tq.id, tq);
        this.selectedTQ = tq;
      });
    } catch (error) {
    } finally {
      runInAction(() => {
        this.isFetchingTQ = false;
      });
    }
  };

  updateTQ = async (tq) => {
    this.isUpdatingTQ = true;
    try {
      const response = await TPQAPI.update(tq);
      runInAction(() => {
        this.TQRegistry.set(response.id, tq);
        this.selectedTQ = response;
      });
      toast.success("Target Questionnaire updated");
    } catch (error) {
      console.error("Error updating Target Questionnaire:", error);
    } finally {
      runInAction(() => {
        this.isUpdatingTQ = false;
      });
    }
  };

  approveTQ = async (approveDTO) => {
    this.isApprovingTQ = true;

    try {
      const response = await TPQAPI.approve(approveDTO);
      runInAction(() => {
        // unset approveDTO.tPQId from TQRegistry
        this.TQRegistry.delete(approveDTO.tPQId);
        this.selectedTQ = null;

        var newTarget = {
          id: response.id,
          name: approveDTO.targetName,
          associatedGenes: approveDTO.associatedGenes,
        };

        this.rootStore.targetStore.targetListRegistry.set(
          response.id,
          newTarget
        );
        this.rootStore.targetStore.isTargetRegistryCacheValid = false;
        this.rootStore.targetStore.isTargetListCacheValid = false;
      });
      toast.success("The Target has been approved.");
    } catch (error) {
      console.error("Error approving Target Questionnaire:", error);
    } finally {
      runInAction(() => {
        this.isApprovingTQ = false;
      });
    }
  };
}
