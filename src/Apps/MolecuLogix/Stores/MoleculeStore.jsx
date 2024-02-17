import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import MolDbAPI from "../api/MolDbAPI";

export default class MoleculeStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      moleculeList: computed,
      isFetchingMolecules: observable,
      fetchMolecules: action,

      fetchMolecule: action,
      isFetchingMolecule: observable,
      moleculeRegistry: observable,
      isMoleculeRegistryCacheValid: observable,
      selectedMolecule: observable,
    });
  }

  // Observables
  isFetchingMolecules = false;
  isFetchingMolecule = false;
  moleculeRegistry = new Map();
  isMoleculeRegistryCacheValid = false;
  selectedMolecule = null;

  // Actions

  fetchMolecules = async (inValidateCache = false) => {
    console.log("fetchMolecules");
    if (inValidateCache) {
      this.isMoleculeListCacheValid = false;
    }
    if (this.isMoleculeListCacheValid) {
      return;
    }
    this.isFetchingMolecules = true;
    try {
      const molecules = await MolDbAPI.listMolecules();
      runInAction(() => {
        molecules.forEach((molecule) => {
          console.log(molecule);
          this.moleculeRegistry.set(molecule.id, molecule);
        });
        this.isMoleculeListCacheValid = true;
      });
    } catch (error) {
      console.error("Error fetching molecules:", error);
    } finally {
      runInAction(() => {
        this.isFetchingMolecules = false;
      });
    }
  };

  get moleculeList() {
    return Array.from(this.moleculeRegistry.values());
  }

  fetchMolecule = async (moleculeId, inValidateCache = false) => {
    if (inValidateCache) {
      this.isMoleculeRegistryCacheValid = false;
    }

    this.isFetchingMolecule = true;
    if (this.isMoleculeRegistryCacheValid) {
      // find molecule in registry and return if found
      const molecule = this.moleculeRegistry.get(moleculeId);
      if (molecule) {
        this.isFetchingMolecule = false;
        this.selectedMolecule = molecule;
      }
    }
    try {
      const molecule = await MolDbAPI.getMoleculeById(moleculeId);
      runInAction(() => {
        this.moleculeRegistry.set(molecule.id, molecule);
        this.isMoleculeRegistryCacheValid = true;
        this.selectedMolecule = molecule;
      });
    } catch (error) {
      console.error("Error fetching molecule:", error);
    } finally {
      runInAction(() => {
        this.isFetchingMolecule = false;
      });
    }
  };
}
