/**
 * ScreenPStore: MobX store class for managing screens.
 *
 * @constructor
 * @param {object} rootStore - A reference to the root store.
 * @property {boolean} isLoadingPhenotypicScreens - Observable, controls the loading state of fetching all screens.
 * @property {Map} phenotypicScreenRegistry - Observable, holds the phenotypic screens fetched from the API.
 * @property {Map} phenotypicScreenExpandedRegistry - Observable, holds the expanded details of phenotypic screens.
 * @property {boolean} isPhenCacheValid - Observable, indicates whether the cache for screens is valid.
 * @property {object} selectedPhenotypicScreen - Observable, holds the selected phenotypic screen's details.
 * @property {boolean} isAddingPhenotypicScreen - Observable, controls the loading state of adding a new screen.
 * @property {boolean} isMergingScreen - Observable, controls the state of merging screens.
 * @property {boolean} isEditingScreen - Observable, controls the state of editing screens.
 * @property {boolean} isEditingScreenRow - Observable, controls the state of editing a screen row.
 * @property {boolean} isUpdatingScreenStatus - Observable, controls the state of updating screen status.
 * @property {boolean} isLoadingPhenotypicScreen - Observable, controls the loading state of fetching a specific screen.
 * @property {boolean} isLoadingPhenotypicScreenSequence - Observable, controls the loading state of adding a new screen sequence.
 * @property {boolean} isEditingPhenotypicScreenSequence - Observable, controls the state of editing a screen sequence.
 * @property {boolean} isUpdatingPhenotypicScreen - Observable, controls the state of updating screen status.
 * @property {boolean} isBatchInsertingPhenotypicScreenSequence - Observable, controls the state of batch inserting screen sequences.
 * @property {boolean} isMergingPhenotypicScreen - Observable, controls the state of merging screens.
 */

import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { toast } from "react-toastify";
import agent from "../../api/agent";
import { generateVoteScore } from "./screenStore_Helper";

export default class ScreenPStore {
  // Initializing observables and other variables
  rootStore;
  isLoadingPhenotypicScreens = false;
  phenotypicScreenRegistry = new Map();
  phenotypicScreenExpandedRegistry = new Map();
  isPhenCacheValid = false;
  selectedPhenotypicScreen = null;
  isAddingPhenotypicScreen = false;
  isMergingScreen = false;
  isEditingScreen = false;
  isEditingScreenRow = false;
  isUpdatingScreenStatus = false;
  isLoadingPhenotypicScreen = false;
  isLoadingPhenotypicScreenSequence = false;
  isEditingPhenotypicScreenSequence = false;
  isUpdatingPhenotypicScreenStatus = false;
  isBatchInsertingPhenotypicScreenSequence = false;
  isUpdatingPhenotypicScreen = false;
  isMergingPhenotypicScreen = false;
  isDeletingScreenRow = false;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      fetchPhenotypicScreens: action,
      isLoadingPhenotypicScreens: observable,
      isPhenCacheValid: observable,
      phenotypicScreenRegistry: observable,
      phenotypicScreenExpandedRegistry: observable,
      selectedPhenotypicScreen: observable,
      phenotypicScreens: computed,
      fetchPhenotypicScreen: action,
      addPhenotypicScreenSequence: action,
      addPhenotypicScreen: action,
      editPhenotypicScreenSequence: action,
      updatePhenotypicScreenStatus: action,
      isLoadingPhenotypicScreen: observable,
      isLoadingPhenotypicScreenSequence: observable,
      isAddingPhenotypicScreen: observable,
      isEditingPhenotypicScreenSequence: observable,
      isUpdatingPhenotypicScreenStatus: observable,
      isBatchInsertingPhenotypicScreenSequence: observable,
      batchInsertPhenotypicScreenSequence: action,
      updatePhenotypicScreen: action,
      isUpdatingPhenotypicScreen: observable,
      isMergingPhenotypicScreen: observable,
      mergePhenotypicScreen: action,
      isDeletingScreenRow: observable,
      deleteScreenRow: action,
    });
  }

  /**
   * Fetches all phenotypic screens from the API and updates the state and cache accordingly. | LIST |
   */
  fetchPhenotypicScreens = async () => {
    this.isLoadingPhenotypicScreens = true;
    if (this.isPhenCacheValid && this.phenotypicScreenRegistry.size !== 0) {
      this.isLoadingPhenotypicScreens = false;
      return;
    }
    try {
      const response = await agent.Screen.listPhenotypic();
      runInAction(() => {
        response.forEach((screen) => {
          this.phenotypicScreenRegistry.set(screen.id, screen);
        });
        this.isPhenCacheValid = true;
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isLoadingPhenotypicScreens = false;
      });
    }
  };

  /**
   * Getter for all the phenotypic screens from the registry.
   * @returns {array} An array of all phenotypic screens.
   */
  get phenotypicScreens() {
    //console.log("Fetching all phenotypic screens");
    return Array.from(this.phenotypicScreenRegistry.values());
  }

  /**
   * Fetches a specific phenotypic screen by ID from API or cache and updates the state accordingly. | READ |
   * @param {number} id - The ID of the screen to fetch.
   * @param {boolean} invalidateCache - If true, forces to fetch from API instead of cache.
   * @param {boolean} shouldSetLoadingState - If true, controls the loading state during the fetch.
   */
  fetchPhenotypicScreen = async (
    id,
    invalidateCache = false,
    shouldSetLoadingState = true
  ) => {
    if (shouldSetLoadingState) {
      this.isLoadingPhenotypicScreen = true;
    }

    // check if cache is valid
    if (!this.isPhenCacheValid) {
      invalidateCache = true;
    }
    // Checking cache first if it is valid
    let fetchedScreen = this.phenotypicScreenExpandedRegistry.get(id);
    if (!invalidateCache && fetchedScreen) {
      this.selectedPhenotypicScreen = fetchedScreen;
      if (shouldSetLoadingState) {
        this.isLoadingPhenotypicScreen = false;
      }
    } else {
      // Fetching from API if not found in cache
      try {
        fetchedScreen = await agent.Screen.details(id);
        runInAction(() => {
          fetchedScreen = generateVoteScore(fetchedScreen);
          this.selectedPhenotypicScreen = fetchedScreen;
          this.phenotypicScreenExpandedRegistry.set(id, fetchedScreen);
        });
      } catch (error) {
        console.error(error);
      } finally {
        if (shouldSetLoadingState) {
          runInAction(() => {
            this.isLoadingPhenotypicScreen = false;
          });
        }
      }
    }
  };

  /**
   * Update a phenotypic screen and updates the state accordingly. | UPDATE |
   * @param {object} editedScreen - The edited screen details to update.
   * @returns {object} The response from the API.
   */
  updatePhenotypicScreen = async (
    editedScreen,
    shouldSetLoadingState = true
  ) => {
    this.isUpdatingPhenotypicScreen = true;
    let res = null;
    try {
      res = await agent.Screen.editPhenotypic(editedScreen.id, editedScreen);
      runInAction(() => {
        if (shouldSetLoadingState) {
          toast.success("Screen has been updated successfully");
        }
        this.isPhenCacheValid = false;
        this.selectedPhenotypicScreen = null;
        // console.log(
        //   "ScreenPStore.js: this.selectedPhenotypicScreen ",
        //   this.selectedPhenotypicScreen
        // );
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isUpdatingPhenotypicScreen = false;
      });
    }
    return res;
  };

  /**
   * Merge a phenotypic screen with another phenotypic screen. | UPDATE |
   * @param {object} mergeDTO - The edited screen details to update.
   * @returns {object} The response from the API.
   */
  mergePhenotypicScreen = async (mergeDTO) => {
    this.isMergingPhenotypicScreen = true;
    let res = null;
    try {
      res = await agent.Screen.mergePhenotypic(mergeDTO);
      runInAction(() => {
        toast.success("Screen has been merged successfully");
        this.isPhenCacheValid = false;
        this.selectedPhenotypicScreen = null;
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isMergingPhenotypicScreen = false;
      });
    }
    return res;
  };

  /**
   * Adds a new phenotypic screen and updates the state accordingly. | CREATE |
   * @param {object} newScreen - The new screen details to add.
   * @returns {object} The response from the API.
   */
  addPhenotypicScreen = async (newScreen) => {
    this.isAddingPhenotypicScreen = true;
    let res = null;
    try {
      res = await agent.Screen.createPhenotypic(newScreen);
      runInAction(() => {
        toast.success("New phenotypic screen has been added successfully");
        this.isPhenCacheValid = false;
        this.selectedPhenotypicScreen = null;
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isAddingPhenotypicScreen = false;
      });
    }
    return res;
  };

  // TODO : Delete

  /**
   * Adds a new phenotypic screen sequence and updates the state accordingly.
   * @param {object} newSequence - The new sequence details to add.
   * @returns {object} The response from the API.
   * @param {boolean} shouldDisplayToast - If true, displays the success toast
   */
  addPhenotypicScreenSequence = async (
    newSequence,
    shouldDisplayToast = true
  ) => {
    this.isLoadingPhenotypicScreenSequence = true;
    let res = null;

    try {
      res = await agent.Screen.createSequence(
        newSequence.screenId,
        newSequence
      );
      runInAction(() => {
        shouldDisplayToast &&
          toast.success("New screen sequence has been added successfully");

        // Removing the specific id from phenotypicScreenExpandedRegistry
        this.phenotypicScreenExpandedRegistry.delete(newSequence.screenId);
        this.selectedPhenotypicScreen = null;
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isLoadingPhenotypicScreenSequence = false;
      });
    }
    return res;
  };

  /**
   * Edits a phenotypic screen sequence and updates the state accordingly.
   * @param {object} editedScreenRow - The details of the screen row to edit.
   * @returns {object} The response from the API.
   * @param {boolean} shouldDisplayToast - If true, displays the success toast
   */
  editPhenotypicScreenSequence = async (
    editedScreenRow,
    shouldDisplayToast = true
  ) => {
    this.isEditingPhenotypicScreenSequence = true;
    let res = null;
    try {
      res = await agent.Screen.editRow(editedScreenRow.id, editedScreenRow);
      runInAction(() => {
        shouldDisplayToast &&
          toast.success("Screen sequence has been updated successfully");
        this.fetchPhenotypicScreen(editedScreenRow.screenId, true);
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isEditingPhenotypicScreenSequence = false;
      });
    }
    return res;
  };

  /**
   * Batch insert a phenotypic screen sequence.
   * Adds new if ID is null, updates if ID is not null.
   * @param {object} editedScreenRows - The details of the screen rows to edit.
   */
  batchInsertPhenotypicScreenSequence = async (editedScreenRows) => {
    this.isBatchInsertingPhenotypicScreenSequence = true;

    try {
      const promises = editedScreenRows.map(async (editedScreenRow) => {
        editedScreenRow.screenId = this.selectedPhenotypicScreen.id;
        if (editedScreenRow.status === "New") {
          //console.log("Adding new row");
          //console.log(editedScreenRow);
          return await this.addPhenotypicScreenSequence(editedScreenRow);
        } else if (editedScreenRow.status === "Modified") {
          //console.log("Editing row");
          //console.log(editedScreenRow);
          return await this.editPhenotypicScreenSequence(editedScreenRow);
        }
      });

      await Promise.all(promises);
      toast.success("Batch insertion/update completed successfully");
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isBatchInsertingPhenotypicScreenSequence = false;
      });
    }
  };

  /**
   * Updates a phenotypic screen's status and updates the state accordingly.
   * @param {number} id - The ID of the screen to update.
   * @param {string} status - The new status.
   * @returns {object} The response from the API.
   */
  updatePhenotypicScreenStatus = async (id, status) => {
    this.isUpdatingPhenotypicScreenStatus = true;
    let res = null;
    try {
      res = await agent.Screen.updateStatus(id, { id: id, status: status });
      runInAction(() => {
        toast.success("Screen status has been updated successfully");
        this.fetchPhenotypicScreen(id, true);
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isUpdatingPhenotypicScreenStatus = false;
      });
    }
    return res;
  };

  // delete screen row
  deleteScreenRow = async (id) => {
    this.isDeletingScreenRow = true;
    let res = null;
    // send to server
    try {
      res = await agent.Screen.deleteRowPhenotypic(
        this.selectedPhenotypicScreen.id,
        id
      );
      runInAction(() => {
        toast.success("Successfully deleted library screen row.");
        this.isDeletingScreenRow = false;
        this.fetchPhenotypicScreen(
          this.selectedPhenotypicScreen.id,
          true,
          true
        );
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isDeletingScreenRow = false;
      });
    }
    return res;
  };
}
