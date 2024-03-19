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
      isFetchingTQ: observable,
      fetchTQUnverified: action,
      isTQCacheValid: observable,

      selectedTargetQuestionnaire: observable,

      targetQuestionnaires: computed,
      targetQuestionnairesUnapproved: computed,
    });
  }

  // Observables
  isFetchingTQ = false;
  isTQCacheValid = false;
  TQRegistry = new Map();
  selectedTargetQuestionnaire = null;

  // Actions
  fetchTQUnverified = async (inValidateCache = false) => {
    if (inValidateCache) {
      this.isTQCacheValid = false;
    }
    if (this.isTQCacheValid) {
      return;
    }
    this.isFetchingTQ = true;
    try {
      const response = await TPQAPI.listUnverified();
      runInAction(() => {
        this.TQRegistry = new Map(
          response.data.map((targetQuestionnaire) => [
            targetQuestionnaire.id,
            targetQuestionnaire,
          ])
        );
        this.isTQCacheValid = true;
      });
    } catch (error) {
      toast.error("Error fetching target questionnaire");
    } finally {
      runInAction(() => {
        this.isFetchingTQ = false;
      });
    }
  };
}
