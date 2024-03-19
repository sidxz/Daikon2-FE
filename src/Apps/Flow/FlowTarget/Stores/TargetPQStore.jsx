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

      isTQCacheValid: observable,
      isTQXVerifiedCacheValid: observable,

      selectedTQ: observable,

      TQUnapproved: computed,
    });
  }

  // Observables
  isFetchingTQList = false;
  isTQCacheValid = false;
  isTQXVerifiedCacheValid = false;
  TQRegistry = new Map();
  selectedTQ = null;

  isFetchingTQ = false;

  // Actions
  fetchTQUnverified = async (inValidateCache = false) => {
    if (inValidateCache) {
      this.isTQXVerifiedCacheValid = false;
    }
    if (this.isTQXVerifiedCacheValid) {
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
        this.isTQXVerifiedCacheValid = true;
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
      console.error("Error fetching Target Questionnaire:", error);
    } finally {
      runInAction(() => {
        this.isFetchingTQ = false;
      });
    }
  };
}
