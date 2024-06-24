import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { toast } from "react-toastify";
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

      registerMolecule: action,
      isRegisteringMolecule: observable,

      updateMolecule: action,
      isUpdatingMolecule: observable,

      findSimilarMolecules: action,
      isFindingSimilarMolecules: observable,
    });
  }

  // Observables
  isFetchingMolecules = false;
  isFetchingMolecule = false;
  moleculeRegistry = new Map();
  isMoleculeRegistryCacheValid = false;
  selectedMolecule = null;
  isRegisteringMolecule = false;
  isUpdatingMolecule = false;
  isFindingSimilarMolecules = false;

  // Actions

  fetchMolecules = async (inValidateCache = false) => {
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
          //console.log(molecule);
          // round off molecularWeight and tpsa to 2 decimal places
          if (
            molecule.molecularWeight != null &&
            molecule.molecularWeight !== ""
          ) {
            molecule.molecularWeight = parseFloat(
              molecule.molecularWeight
            ).toFixed(2);
          } else {
            molecule.molecularWeight = 0;
          }

          if (molecule.tpsa != null && molecule.tpsa !== "") {
            molecule.tpsa = parseFloat(molecule.tpsa).toFixed(2);
          } else {
            molecule.tpsa = 0;
          }
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
        molecule.molecularWeight = molecule.molecularWeight.toFixed(2);
        molecule.tpsa = molecule.tpsa.toFixed(2);
        this.moleculeRegistry.set(molecule.id, molecule);
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

  registerMolecule = async (molecule) => {
    // reject if molecule smiles is not set
    if (!molecule.requestedSMILES) {
      toast.error("Molecule smiles is required");
      throw new Error("Molecule smiles is required");
    }

    this.isRegisteringMolecule = true;
    try {
      const res = await MolDbAPI.registerMolecule(molecule);
      runInAction(() => {
        // check if res has property similarity
        // if yes, then the molecule is already registered

        if (res.wasAlreadyRegistered) {
          toast.warning(
            `The molecule is already registered under name: ${res.name}`
          );
        } else {
          this.moleculeRegistry.set(res.id, res);
          toast.success("Molecule registered successfully");
        }
      });
    } catch (error) {
      console.error("Error registering molecule:", error);
    } finally {
      runInAction(() => {
        this.isRegisteringMolecule = false;
      });
    }
  };

  updateMolecule = async (molecule) => {
    // reject if molecule smiles is not set
    if (!molecule.requestedSMILES) {
      toast.error("Molecule smiles is required");
      throw new Error("Molecule smiles is required");
    }

    this.isUpdatingMolecule = true;
    try {
      const res = await MolDbAPI.updateMolecule(molecule);
      runInAction(() => {
        this.moleculeRegistry.set(res.id, res);
        this.selectedMolecule = res;
        toast.success("Molecule updated successfully");
      });
    } catch (error) {
      console.error("Error updating molecule:", error);
    } finally {
      runInAction(() => {
        this.isUpdatingMolecule = false;
      });
    }
  };

  findSimilarMolecules = async (smiles, threshold = 0.01, limit = 10) => {
    this.isFindingSimilarMolecules = true;
    try {
      let res = await MolDbAPI.findSimilarMolecules(smiles, threshold, limit);
      runInAction(() => {
        //console.log(res);
        this.isFindingSimilarMolecules = false;
      });
    } catch (error) {
      console.error("Error finding similar molecules:", error);
    } finally {
      runInAction(() => {
        this.isFindingSimilarMolecules = false;
      });
    }
  };
}
