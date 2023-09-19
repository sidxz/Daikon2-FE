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
    });
  }
  /* Fetch specific TargetAdmin with id from API */

  fetchTargetAdmin = async (id) => {
    this.displayLoading = true;

    // first check cache
    let fetchedTargetAdmin = this.targetRegistryAdmin.get(id);

    if (fetchedTargetAdmin) {
      this.selectedTarget = fetchedTargetAdmin;
      this.displayLoading = false;
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
          this.displayLoading = false;
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
}
