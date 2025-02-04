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

    // Define MobX observables, actions, and computed properties
    makeObservable(this, {
      associations: computed, // Computed value for current associations
      fetchAssociationsForMolecule: action, // Fetch associations action
      isFetching: observable, // Whether data is being fetched
      associationsRegistry: observable, // Cached associations by molecule ID
      isCacheValid: observable, // Cache validity flag
      selectedMoleculeId: observable, // Currently selected molecule ID
    });

    // Initialize default state
  }

  isFetching = false;
  associationsRegistry = new Map();
  isCacheValid = false;
  selectedMoleculeId = null;

  /**
   * Fetch associations for a molecule.
   * @param {string} moleculeId - The ID of the molecule to fetch associations for.
   * @param {boolean} invalidateCache - Whether to force refresh the cache.
   */
  fetchAssociationsForMolecule = async (
    moleculeId,
    invalidateCache = false
  ) => {
    if (invalidateCache || this.selectedMoleculeId !== moleculeId) {
      this.isCacheValid = false;
    }

    // Update the selected molecule ID
    this.selectedMoleculeId = moleculeId;

    // Exit early if cache is valid
    if (this.isCacheValid) {
      return;
    }

    this.isFetching = true;

    try {
      const associations = await GraphMolAPI.findMoleculeRelations(moleculeId);

      // Update state in an observable-friendly way
      runInAction(() => {
        this.associationsRegistry.set(moleculeId, associations);
        this.isCacheValid = true;
      });
    } catch (error) {
      console.error(
        `Failed to fetch associations for molecule ID: ${moleculeId}`,
        error
      );
    } finally {
      // Ensure fetching state is updated even if an error occurs
      runInAction(() => {
        this.isFetching = false;
      });
    }
  };

  /**
   * Get the associations for the selected molecule.
   * @returns {Array} The list of associations for the selected molecule.
   */
  get associations() {
    if (!this.selectedMoleculeId) return [];
    return this.associationsRegistry.get(this.selectedMoleculeId) || [];
  }

  /**
   * Get filtered associations for the selected molecule based on a node type.
   * @param {string|null} nodeTypeFilter - The node type to filter associations by.
   * @returns {Array} The filtered list of associations.
   */
  getFilteredAssociations = (nodeTypeFilter = null) => {
    // Check if a molecule is selected
    console.log("Inside getFilteredAssociations");
    console.log("Molecule Id is", this.selectedMoleculeId);
    console.log("Node Type Filter is", nodeTypeFilter);
    if (!this.selectedMoleculeId) {
      console.warn(
        "No molecule selected. Unable to fetch filtered associations."
      );
      return [];
    }

    // Get all associations for the selected molecule
    const allAssociations =
      this.associationsRegistry.get(this.selectedMoleculeId) || [];

    // Log a warning if no associations exist
    if (allAssociations.length === 0) {
      console.warn(
        `No associations found for molecule ID: ${this.selectedMoleculeId}`
      );
      return [];
    }

    // Filter associations if a filter is provided
    return nodeTypeFilter
      ? allAssociations.filter(
          (association) => association.nodeType === nodeTypeFilter
        )
      : allAssociations;
  };
}
