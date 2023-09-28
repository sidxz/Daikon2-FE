import { action, makeObservable, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import agent from "../../api/agent";

export default class TargetStoreAdmin {
  rootStore;
  displayLoading = false;
  editingTarget = false;
  targetRegistryAdmin = new Map();
  selectedTarget = null;

  isMergingTargets = false;
  isRenamingTargets = false;
  isUpdatingGeneAssociation = false;

  isBatchUpdatingTargets = false;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      displayLoading: observable,
      editingTarget: observable,
      targetRegistryAdmin: observable,
      fetchTargetAdmin: action,
      selectedTarget: observable,
      editTargetAdmin: action,
      importTarget: action,
      importTargetComplex: action,

      mergeTargets: action,
      isMergingTargets: observable,

      renameTarget: action,
      isRenamingTargets: observable,

      updateGeneAssociation: action,
      isUpdatingGeneAssociation: observable,

      batchUpdateTargets: action,
      isBatchUpdatingTargets: observable,
    });
  }
  /* Fetch specific TargetAdmin with id from API */

  fetchTargetAdmin = async (
    id,
    invalidateCache = false,
    shouldSetLoadingState = true
  ) => {
    if (shouldSetLoadingState) this.displayLoading = true;

    // first check cache
    let fetchedTargetAdmin = this.targetRegistryAdmin.get(id);

    if (!invalidateCache && fetchedTargetAdmin) {
      this.selectedTarget = fetchedTargetAdmin;
      if (shouldSetLoadingState) {
        this.displayLoading = false;
      }
    }

    // if not found fetch from api
    else {
      try {
        fetchedTargetAdmin = await agent.TargetAdmin.details(id);
        runInAction(() => {
          this.selectedTarget = fetchedTargetAdmin;
          this.targetRegistryAdmin.set(id, fetchedTargetAdmin);
        });
      } catch (error) {
        console.error(error);
      } finally {
        runInAction(() => {
          if (shouldSetLoadingState) this.displayLoading = false;
        });
      }
    }
  };

  /* Edit TargetAdmin */

  editTargetAdmin = async (newTarget) => {
    this.editingTarget = true;
    let updatedTarget = null;

    // send to servers
    try {
      updatedTarget = await agent.TargetAdmin.edit(newTarget);

      runInAction(() => {
        this.targetRegistryAdmin.delete(updatedTarget.id);
        this.fetchTargetAdmin(updatedTarget.id);

        toast.success("Changes are saved");
      });
    } catch (error) {
      console.error(error);
      toast.error(error.data.title);
    } finally {
      runInAction(() => {
        this.editingTarget = false;
      });
    }
    return updatedTarget;
  };

  /**
   * Batch update targets
   * Updates existing targets.
   * New targets are NOT created.
   * @param {object} editedScreenRows - The details of the screen rows to edit.
   */
  batchUpdateTargets = async (editedTargets) => {
    this.isBatchUpdatingTargets = true;

    try {
      const promises = editedTargets.map(async (editedTarget) => {
        if (editedTarget.status === "New") {
          //console.log("Adding new row");
          //console.log(editedTarget);
          toast.warn(
            "New targets " + editedTarget.name + "cannot be added in batch mode"
          );
        } else if (editedTarget.status === "Modified") {
          console.log("Editing row");
          console.log(editedTarget);
          return await this.editTargetAdmin(editedTarget);
        }
      });

      await Promise.all(promises);
      toast.success("Batch insertion/update completed successfully");
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isBatchUpdatingTargets = false;
      });
    }
  };

  importTarget = async (targetEntry) => {
    this.displayLoading = true;
    try {
      var res = await agent.TargetAdmin.import(targetEntry);

      runInAction(() => {});
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      runInAction(() => {
        this.displayLoading = false;
      });
    }
    return res;
  };

  importTargetComplex = async (targetEntry) => {
    this.displayLoading = true;
    try {
      var res = await agent.TargetAdmin.importComplex(targetEntry);

      runInAction(() => {});
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      runInAction(() => {
        this.displayLoading = false;
      });
    }
    return res;
  };

  /* Merge Targets */

  mergeTargets = async (targetToBeKept, targetToBeMerged) => {
    this.isMergingTargets = true;
    console.log(targetToBeKept.id, targetToBeMerged.id);

    let res = null;
    // send to server
    try {
      res = await agent.TargetAdmin.merge(targetToBeKept.id, {
        baseTargetId: targetToBeKept.id,
        targetToMergeId: targetToBeMerged.id,
      });

      runInAction(() => {
        toast.success("Successfully Merged Targets");
        this.isMergingTargets = false;
        this.rootStore.targetStore.fetchTargets(true);
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isMergingTargets = false;
      });
    }
    return res;
  };

  /* Rename Target */

  renameTarget = async (id, newName) => {
    this.isRenamingTargets = true;

    let res = null;
    // send to server
    try {
      res = await agent.TargetAdmin.rename(id, {
        id: id,
        targetNameToSet: newName,
      });

      runInAction(() => {
        toast.success("Successfully Renamed Target");
        this.isRenamingTargets = false;
        this.rootStore.targetStore.fetchTargets(true);
        this.rootStore.targetStore.fetchTarget(id, true);
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isRenamingTargets = false;
      });
    }
    return res;
  };

  updateGeneAssociation = async (id, newGenes) => {
    this.isUpdatingGeneAssociation = true;

    let res = null;
    // send to server
    try {
      res = await agent.TargetAdmin.updateGeneAssociation(id, newGenes);

      runInAction(() => {
        toast.success("Successfully updated gene association");
        this.isUpdatingGeneAssociation = false;
        this.rootStore.compoundEvolutionStore.isCompoundEvolutionRegistryCacheValid = false;
        this.rootStore.targetStore.fetchTargets(true);
        this.rootStore.targetStore.fetchTarget(id, true);
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isUpdatingGeneAssociation = false;
      });
    }
    return res;
  };
}
