// Importing required libraries and components
import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { toast } from "react-toastify";

import agent from "../../api/agent"; // API agent for making network requests
import { generateVoteScore } from "./screenStore_Helper"; // Helper function to calculate score

// Main class for ScreenTStore
export default class ScreenTStore {
  // Properties

  rootStore; // Root store reference

  // Flags for various loading states
  isLoadingTargetBasedScreens = false;
  isFilteringScreensByTargetName = false;
  isLoadingTargetBasedScreen = false;
  isAddingScreenSequence = false;
  isMergingScreen = false;
  isEditingScreen = false;
  isEditingScreenSequence = false;
  isUpdatingScreenStatus = false;
  isBatchInsertingTargetBasedScreenSequence = false;
  isDeletingScreenRow = false;
  isUpdatingTargetAssociation = false;
  isDeletingScreen = false;

  // Data stores
  targetBasedScreenRegistry = new Map();
  isTgScreenRegistryCacheValid = false;
  targetBasedScreenRegistryExpanded = new Map();
  selectedTargetBasedScreen = null;
  selectedScreenTargetFilter = null;
  filteredScreens = [];

  // Index properties
  validatedHitsIndex = 0;
  screenSequenceIndex = 0;
  loadingPhenotypicAdd = false;

  // Constructor: initialize the observables
  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      // Observable properties
      isLoadingTargetBasedScreens: observable,
      isFilteringScreensByTargetName: observable,
      isLoadingTargetBasedScreen: observable,
      selectedTargetBasedScreen: observable,
      targetBasedScreenRegistry: observable,
      isTgScreenRegistryCacheValid: observable,
      targetBasedScreenRegistryExpanded: observable,
      isAddingScreenSequence: observable,
      filteredScreens: observable,
      validatedHitsIndex: observable,
      screenSequenceIndex: observable,
      selectedScreenTargetFilter: observable,
      isMergingScreen: observable,
      isEditingScreen: observable,
      isEditingScreenSequence: observable,
      isUpdatingScreenStatus: observable,
      isBatchInsertingTargetBasedScreenSequence: observable,
      isDeletingScreenRow: observable,
      isUpdatingTargetAssociation: observable,

      // Actions and computed properties
      fetchTargetBasedScreens: action,
      targetBasedScreens: computed,
      targetBasedUniqueScreens: computed,
      fetchTargetBasedScreen: action,
      addScreenSequence: action,
      filterTargetBasedScreensByTarget: action,
      setValidatedHitsIndex: action,
      setScreenSequenceIndex: action,
      mergeScreen: action,
      editScreen: action,
      editScreenSequence: action,
      updateScreenStatus: action,
      batchInsertTargetBasedScreenSequence: action,
      deleteScreenRow: action,
      updateTargetAssociation: action,

      isDeletingScreen: observable,
      deleteScreen: action,
    });
  }

  // Fetch list of screens from the API
  fetchTargetBasedScreens = async (invalidateCache = false) => {
    this.isLoadingTargetBasedScreens = true;

    if (invalidateCache) {
      this.isTgScreenRegistryCacheValid = false;
    }

    // Check if the cache is valid and not empty
    if (
      this.isTgScreenRegistryCacheValid &&
      this.targetBasedScreenRegistry.size !== 0
    ) {
      this.isLoadingTargetBasedScreens = false;
      return;
    }
    try {
      const resp = await agent.Screen.list();
      runInAction(() => {
        resp.forEach((fetchedScreen) => {
          this.targetBasedScreenRegistry.set(fetchedScreen.id, fetchedScreen);
        });
        this.isTgScreenRegistryCacheValid = true;
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isLoadingTargetBasedScreens = false;
      });
    }
  };

  // Computed property to get screens from the registry
  get targetBasedScreens() {
    return Array.from(this.targetBasedScreenRegistry.values());
  }

  // Computed property to get unique screens based on target name
  get targetBasedUniqueScreens() {
    const targetsScreened = new Map();
    this.targetBasedScreenRegistry.forEach((value) => {
      targetsScreened.set(value.targetName, value);
    });
    return Array.from(targetsScreened.values());
  }

  // Filter screens by target name
  filterTargetBasedScreensByTarget = (targetName) => {
    this.isFilteringScreensByTargetName = true;
    this.selectedScreenTargetFilter = targetName;
    this.filteredScreens = [];
    this.filteredScreens = Array.from(
      this.targetBasedScreenRegistry.values()
    ).filter((screen) => screen.targetName === targetName);
    this.isFilteringScreensByTargetName = false;
    return this.filteredScreens;
  };

  // Fetch a specific screen based on ID from the API
  fetchTargetBasedScreen = async (
    id,
    invalidateCache = false,
    shouldSetLoadingState = true
  ) => {
    if (shouldSetLoadingState) {
      this.isLoadingTargetBasedScreen = true;
    }

    // First check the cache
    let fetchedScreen = this.targetBasedScreenRegistryExpanded.get(id);
    if (!invalidateCache && fetchedScreen) {
      this.selectedTargetBasedScreen = fetchedScreen;
      if (shouldSetLoadingState) {
        this.isLoadingTargetBasedScreen = false;
      }
    } else {
      // If not in cache, fetch from the API
      try {
        fetchedScreen = await agent.Screen.details(id);
        runInAction(() => {
          fetchedScreen = generateVoteScore(fetchedScreen);
          this.selectedTargetBasedScreen = fetchedScreen;
          this.targetBasedScreenRegistryExpanded.set(id, fetchedScreen);
        });
      } catch (error) {
        console.error(error);
      } finally {
        runInAction(() => {
          if (shouldSetLoadingState) {
            this.isLoadingTargetBasedScreen = false;
          }
        });
      }
    }
  };

  // Edit screen details
  editScreen = async (editedScreen) => {
    this.isEditingScreen = true;
    let res = null;
    try {
      res = await agent.Screen.edit(editedScreen.id, editedScreen);
      runInAction(() => {
        toast.success("Saved");
        this.fetchTargetBasedScreen(editedScreen.id, true);
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isEditingScreen = false;
      });
    }
    return res;
  };

  // delete screen
  deleteScreen = async (id) => {
    this.isDeletingScreen = true;
    let res = null;
    // send to server
    try {
      res = await agent.Screen.delete(id);
      runInAction(() => {
        toast.success("Successfully deleted screen.");
        this.isDeletingScreen = false;
        this.isTgScreenRegistryCacheValid = false;
        this.fetchTargetBasedScreens();
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isDeletingScreen = false;
      });
    }
    return res;
  };

  // Add new screen sequence
  addScreenSequence = async (newSequence) => {
    this.isAddingScreenSequence = true;
    let res = null;
    try {
      res = await agent.Screen.createSequence(
        newSequence.screenId,
        newSequence
      );
      runInAction(() => {
        toast.success("Successfully added screening information");
        this.targetBasedScreenRegistryExpanded.clear();
        this.selectedTargetBasedScreen = null;
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isAddingScreenSequence = false;
      });
    }
    return res;
  };

  // Edit screen sequence
  editScreenSequence = async (editedScreenRow) => {
    this.isEditingScreenSequence = true;
    let res = null;
    try {
      res = await agent.Screen.editRow(editedScreenRow.id, editedScreenRow);
      runInAction(() => {
        toast.success("Saved");
        this.fetchTargetBasedScreen(editedScreenRow.screenId, true);
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isEditingScreenSequence = false;
      });
    }
    return res;
  };

  /**
   * Batch insert a phenotypic screen sequence.
   * Adds new if ID is null, updates if ID is not null.
   * @param {object} editedScreenRows - The details of the screen rows to edit.
   */
  batchInsertTargetBasedScreenSequence = async (editedScreenRows) => {
    this.isBatchInsertingTargetBasedScreenSequence = true;

    try {
      const promises = editedScreenRows.map(async (editedScreenRow) => {
        editedScreenRow.screenId = this.selectedTargetBasedScreen.id;
        if (editedScreenRow.status === "New") {
          //console.log("Adding new row");
          //console.log(editedScreenRow);
          return await this.addScreenSequence(editedScreenRow);
        } else if (editedScreenRow.status === "Modified") {
          //console.log("Editing row");
          //console.log(editedScreenRow);
          return await this.editScreenSequence(editedScreenRow);
        }
      });

      await Promise.all(promises);
      toast.success("Batch insertion/update completed successfully");
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isBatchInsertingTargetBasedScreenSequence = false;
      });
    }
  };

  // Merge screens
  mergeScreen = async (mergeIDs) => {
    this.isMergingScreen = true;
    let res = null;
    try {
      res = await agent.Screen.merge(mergeIDs);
      runInAction(() => {
        toast.success("Successfully merged screening information");
        this.targetBasedScreenRegistryExpanded.clear();
        this.isTgScreenRegistryCacheValid = false;
        this.selectedTargetBasedScreen = null;
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isMergingScreen = false;
      });
    }
    return res;
  };

  // Update screen status
  updateScreenStatus = async (id, status) => {
    this.isUpdatingScreenStatus = true;
    let res = null;
    try {
      res = await agent.Screen.updateStatus(id, { id: id, status: status });
      runInAction(() => {
        toast.success("Saved");
        this.fetchTargetBasedScreen(id, true);
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isUpdatingScreenStatus = false;
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
      res = await agent.Screen.deleteRow(this.selectedTargetBasedScreen.id, id);
      runInAction(() => {
        toast.success("Successfully deleted library screen row.");
        this.isDeletingScreenRow = false;
        this.fetchTargetBasedScreen(this.selectedTargetBasedScreen.id, true);
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

  updateTargetAssociation = async (screenId, updateTargetId) => {
    this.isUpdatingTargetAssociation = true;
    let res = null;
    // send to server
    try {
      res = await agent.Screen.updateTargetAssociation(screenId, {
        screenId: screenId,
        targetId: updateTargetId,
      });
      runInAction(() => {
        toast.success("Successfully updated target association.");
        this.isTgScreenRegistryCacheValid = false;
        this.rootStore.compoundEvolutionStore.isCompoundEvolutionRegistryCacheValid = false;
        this.fetchTargetBasedScreens();
        this.fetchTargetBasedScreen(screenId, true);
        this.isUpdatingTargetAssociation = false;
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isUpdatingTargetAssociation = false;
      });
    }
    return res;
  };

  // Setters for index properties
  setValidatedHitsIndex = (index) => (this.validatedHitsIndex = index);
  setScreenSequenceIndex = (index) => (this.screenSequenceIndex = index);
}
