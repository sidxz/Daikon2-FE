import { action, makeObservable, observable, runInAction } from "mobx";
import HorizonAPI from "./HorizonApi";

export default class HorizonStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      fetchHorizon: action,
      isFetchingHorizon: observable,
      horizonRegistry: observable,
      selectedHorizon: observable,
      isHorizonCacheValid: observable,
    });
  }

  // Observables

  isFetchingHorizon = false;
  horizonRegistry = new Map();
  selectedHorizon = null;
  isHorizonCacheValid = false;

  // Actions

  fetchHorizon = async (id, inValidateCache = false) => {
    if (inValidateCache) {
      this.isHorizonCacheValid = false;
    }

    this.isFetchingHorizon = true;

    try {
      var horizon = await HorizonAPI.get(id);
      runInAction(() => {
        this.horizonRegistry.set(id, horizon);
        this.selectedHorizon = horizon;
        this.isHorizonCacheValid = true;
      });
    } catch (error) {
      console.error("Error fetching hitCollection:", error);
    } finally {
      runInAction(() => {
        this.isFetchingHorizon = false;
      });
    }
  };
}
