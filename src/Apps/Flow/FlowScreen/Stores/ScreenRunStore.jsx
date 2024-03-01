import { action, makeObservable, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import ScreenRunAPI from "../api/ScrenRunAPI";
export default class ScreenRunStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;

    makeObservable(this, {
      isUpdatingScreenRun: observable,
      updateScreenRun: action,

      isAddingScreenRun: observable,
      addScreenRun: action,

      isDeletingScreenRun: observable,
      deleteScreenRun: action,
      isBatchInsertingScreenRuns: observable,
      batchInsertScreenRuns: action,
    });
  }

  // Observables
  isUpdatingScreenRun = false;
  isAddingScreenRun = false;
  isDeletingScreenRun = false;
  isBatchInsertingScreenRuns = false;

  // Actions
  addScreenRun = async (screenRun, silent = false) => {
    this.isAddingScreenRun = true;
    console.log("Adding screen run");
    console.log(screenRun);

    // Ensure screenRun.screenId is set ,error out if not
    if (!screenRun.screenId?.trim()) {
      throw new Error("screenId is required and cannot be empty.");
    }

    try {
      var res = await ScreenRunAPI.create(screenRun);
      runInAction(() => {
        // Add screenRun to screenRun list
        screenRun.id = res.id;
        const screen = this.rootStore.screenStore.screenRegistry.get(
          screenRun.screenId
        );
        screen.screenRuns.push(screenRun);
        this.rootStore.screenStore.selectedScreen = screen;

        if (!silent) toast.success("Screen run added successfully");
      });
    } catch (error) {
      console.error("Error adding Screen run:", error);
    } finally {
      runInAction(() => {
        this.isAddingScreenRun = false;
      });
    }
  };

  updateScreenRun = async (screenRun, silent = false) => {
    this.isUpdatingScreenRun = true;

    try {
      screenRun.screenRunId = screenRun.id;

      await ScreenRunAPI.update(screenRun);
      runInAction(() => {
        const screen = this.rootStore.screenStore.screenRegistry.get(
          this.rootStore.screenStore.selectedScreen.id
        );
        const index = screen.screenRuns.findIndex((s) => s.id === screenRun.id);
        screen.screenRuns[index] = screenRun;
        this.rootStore.screenStore.selectedScreen = screen;

        if (!silent) toast.success("Screen run updated successfully");
      });
    } catch (error) {
      console.error("Error updating Screen run:", error);
    } finally {
      runInAction(() => {
        this.isUpdatingScreenRun = false;
      });
    }
  };

  deleteScreenRun = async (screenRunId, silent = false) => {
    this.isDeletingScreenRun = true;

    try {
      await ScreenRunAPI.delete(
        this.rootStore.screenStore.selectedScreen.id,
        screenRunId
      );
      runInAction(() => {
        const screen = this.rootStore.screenStore.screenRegistry.get(
          this.rootStore.screenStore.selectedScreen.id
        );

        const index = screen.screenRuns.findIndex((s) => s.id === screenRunId);
        screen.screenRuns.splice(index, 1);

        this.rootStore.screenStore.selectedScreen = screen;

        if (!silent) toast.success("Screen run deleted successfully");
      });
    } catch (error) {
      console.error("Error deleting Screen run:", error);
    } finally {
      runInAction(() => {
        this.isDeletingScreenRun = false;
      });
    }
  };

  /**
   * Batch insert screen runs
   */
  batchInsertScreenRuns = async (editedRows) => {
    //console.log("Batch inserting screen runs");
    //console.log(editedRows);
    this.isBatchInsertingScreenRuns = true;

    try {
      const promises = editedRows.map(async (editedRow) => {
        // Fix ids
        editedRow.screenId = this.rootStore.screenStore.selectedScreen.id;

        if (editedRow.status === "New") {
          return await this.addScreenRun(editedRow, true);
        } else if (editedRow.status === "Modified") {
          return await this.updateScreenRun(editedRow, true);
        }
      });

      await Promise.all(promises);
      toast.success("Batch insertion/update completed successfully");
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isBatchInsertingScreenRuns = false;
      });
    }
  };
}
