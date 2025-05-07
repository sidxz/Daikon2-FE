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
      associations: computed, // Computed value for selected molecule associations
      fetchAssociationsForMolecules: action, // Fetch associations for multiple molecules
      isFetching: observable, // Whether data is being fetched
      associationsRegistry: observable, // Cached associations by molecule ID
      cacheValidity: observable, // Tracks validity per molecule ID
      selectedMoleculeId: observable, // Currently selected molecule ID
    });

    // Initialize default state
  }

  isFetching = false;
  associationsRegistry = new Map(); // Stores relations for each molecule
  cacheValidity = new Map(); // Tracks cache validity per molecule
  selectedMoleculeId = null;

  /**
   * Fetch associations for multiple molecules in one request.
   * @param {Array<string>} moleculeIds - List of molecule IDs to fetch associations for.
   * @param {boolean} invalidateCache - Whether to force refresh the cache.
   */
  fetchAssociationsForMolecules = async (
    moleculeIds,
    invalidateCache = false
  ) => {
    // console.log(
    //   `Fetching associations for ${moleculeIds.length} molecule(s). Invalidate cache: ${invalidateCache}`
    // );

    if (!Array.isArray(moleculeIds) || moleculeIds.length === 0) {
      console.warn("No molecule IDs provided for association lookup.");
      return;
    }

    // Filter out invalid guids and nulls from the list
    moleculeIds = moleculeIds.filter((id) => id && id.length === 36);
    // Filter out 00000000-0000-0000-0000-000000000000
    moleculeIds = moleculeIds.filter(
      (id) => id !== "00000000-0000-0000-0000-000000000000"
    );

    // Filter out molecule IDs that are already cached (if cache is valid)
    const idsToFetch = moleculeIds.filter(
      (id) => invalidateCache || !this.cacheValidity.get(id)
    );

    if (idsToFetch.length === 0) {
      console.log("All requested molecule associations are already cached.");
      return;
    }

    this.isFetching = true;

    try {
      // Fetch relations in a single API call
      const response = await GraphMolAPI.findMoleculeRelationsBatch(idsToFetch);

      runInAction(() => {
        //console.log("Raw API Response:", response);
        // Ensure we are correctly extracting "relations" from the response
        const relationsData = response.relations || {};

        Object.entries(relationsData).forEach(([moleculeId, relations]) => {
          // console.log(
          //   `Storing relations for moleculeId: ${moleculeId}`,
          //   relations
          // );
          this.associationsRegistry.set(moleculeId, relations);
          this.cacheValidity.set(moleculeId, true); // Mark cache as valid
        });

        //console.log("Updated associationsRegistry:", this.associationsRegistry);
      });
    } catch (error) {
      console.error("Failed to fetch associations for molecules:", error);
    } finally {
      runInAction(() => {
        this.isFetching = false;
      });
    }
  };

  /**
   * Fetch associations for a single molecule (wrapper around multi-fetch).
   * @param {string} moleculeId - The ID of the molecule.
   * @param {boolean} invalidateCache - Whether to force refresh the cache.
   */
  fetchAssociationsForMolecule = async (
    moleculeId,
    invalidateCache = false
  ) => {
    if (!moleculeId) {
      console.warn("No molecule ID provided for association lookup.");
      return;
    }
    this.selectedMoleculeId = moleculeId;
    await this.fetchAssociationsForMolecules([moleculeId], invalidateCache);
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
    if (!this.selectedMoleculeId) {
      console.warn(
        "No molecule selected. Unable to fetch filtered associations."
      );
      return [];
    }

    const allAssociations =
      this.associationsRegistry.get(this.selectedMoleculeId) || [];

    if (allAssociations.length === 0) {
      console.warn(
        `No associations found for molecule ID: ${this.selectedMoleculeId}`
      );
      return [];
    }

    return nodeTypeFilter
      ? allAssociations.filter(
          (association) => association.nodeType === nodeTypeFilter
        )
      : allAssociations;
  };
}
