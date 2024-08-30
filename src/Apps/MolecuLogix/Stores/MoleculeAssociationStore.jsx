import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import GraphMolAPI from "../api/GraphMolAPI";

export default class MoleculeAssociationStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      associations: computed,
      fetchAssociationsForMolecule: action,
      isFetching: observable,
      associationsRegistry: observable,
      isCacheValid: observable,
      selectedMoleculeId: observable,
    });
  }

  // Initial state
  isFetching = false;
  associationsRegistry = new Map(); // Stores associations by molecule ID
  isCacheValid = false;
  selectedMoleculeId = null;

  // Computed values

  get associations() {
    if (!this.selectedMoleculeId) return [];
    return this.associationsRegistry.get(this.selectedMoleculeId) || [];
  }

  // Actions

  fetchAssociationsForMolecule = async (
    moleculeId,
    invalidateCache = false
  ) => {
    if (invalidateCache || this.selectedMoleculeId !== moleculeId) {
      this.isCacheValid = false;
    }

    this.selectedMoleculeId = moleculeId;

    if (this.isCacheValid) {
      return;
    }

    this.isFetching = true;
    try {
      const associations = await GraphMolAPI.findMoleculeRelations(moleculeId);
      runInAction(() => {
        this.associationsRegistry.set(moleculeId, associations);
        this.isCacheValid = true;
      });
    } catch (error) {
      console.error("Error fetching associations for molecule:", error);
    } finally {
      runInAction(() => {
        this.isFetching = false;
      });
    }
  };
}
