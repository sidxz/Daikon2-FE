import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { toast } from "react-toastify";
import agent from "../../api/agent";
import { _helper_associatedGenesAccessionNumbersToArray } from "./targetStoreHelper";

export default class TargetStore {
  rootStore;
  displayLoading = false;
  targetRegistry = new Map();
  targetRegistryExpanded = new Map();
  selectedTarget = null;

  cacheValid = false;
  promoteTargetToScreenDisplayLoading = false;

  selectedTargetHistory = null;
  historyDisplayLoading = false;
  targetHistoryRegistry = new Map();

  isEditingTargetPromotionInfo = false;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      displayLoading: observable,

      targets: computed,
      fetchTargetList: action,
      targetRegistry: observable,

      target: computed,
      fetchTarget: action,
      fetchTargetByName: action,
      selectedTarget: observable,

      promoteTargetToScreenDisplayLoading: observable,
      promoteTargetToScreen: action,

      historyDisplayLoading: observable,
      fetchTargetHistory: action,
      selectedTargetHistory: observable,
      targetHistory: computed,

      editTargetSummary: action,
      cancelEditTargetSummary: action,

      editTargetPromotionInfo: action,
      isEditingTargetPromotionInfo: observable,
    });
  }

  /* end helpers */

  /* Fetch Target list from API */
  fetchTargetList = async (invalidateCache = false) => {
    this.displayLoading = true;
    if (invalidateCache) {
      this.cacheValid = false;
    }
    // first check cache
    if (this.cacheValid && this.targetRegistry.size !== 0) {
      this.displayLoading = false;
      return;
    }
    try {
      var resp = await agent.Target.list();
      runInAction(() => {
        resp.forEach((fetchedTarget) => {
          fetchedTarget = {
            ...fetchedTarget,
            targetGenesAccessionNumbers:
              _helper_associatedGenesAccessionNumbersToArray(fetchedTarget),
          };
          //
          //
          this.targetRegistry.set(fetchedTarget.id, fetchedTarget);
        });
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.cacheValid = true;
        this.displayLoading = false;
      });
    }
  };

  get targets() {
    return Array.from(this.targetRegistry.values());
  }

  /* Fetch specific Target with id from API */

  fetchTarget = async (id, invalidateCache = false) => {
    this.displayLoading = true;
    if (invalidateCache) {
      this.cacheValid = false;
    }

    // first check cache
    let fetchedTarget = this.targetRegistryExpanded.get(id);

    if (this.cacheValid && fetchedTarget) {
      this.selectedTarget = fetchedTarget;
      this.displayLoading = false;
    }
    // if not found fetch from api
    else {
      try {
        fetchedTarget = await agent.Target.details(id);
        runInAction(() => {
          fetchedTarget = {
            ...fetchedTarget,
            targetGenesAccessionNumbers:
              _helper_associatedGenesAccessionNumbersToArray(fetchedTarget),
          };

          this.selectedTarget = fetchedTarget;
          this.targetRegistryExpanded.set(id, fetchedTarget);
        });
      } catch (error) {
        console.error(error);
      } finally {
        runInAction(() => {
          this.displayLoading = false;
          this.cacheValid = true;
        });
      }
    }
  };

  fetchTargetByName = async (name, invalidateCache = false) => {
    this.displayLoading = true;
    if (invalidateCache) {
      this.cacheValid = false;
    }

    // first check cache
    let fetchedTarget = Array.from(this.targetRegistryExpanded.values()).find(
      (el) => el.name === name
    );

    if (this.cacheValid && fetchedTarget) {
      this.selectedTarget = fetchedTarget;
      this.displayLoading = false;
    }
    // if not found fetch from api
    else {
      try {
        fetchedTarget = await agent.Target.detailsByName(name);
        runInAction(() => {
          fetchedTarget = {
            ...fetchedTarget,
            targetGenesAccessionNumbers:
              _helper_associatedGenesAccessionNumbersToArray(fetchedTarget),
          };

          this.selectedTarget = fetchedTarget;
          this.targetRegistryExpanded.set(fetchedTarget.id, fetchedTarget);
        });
      } catch (error) {
        console.error(error);
      } finally {
        runInAction(() => {
          this.displayLoading = false;
          this.cacheValid = true;
        });
      }
    }
  };

  get target() {
    return this.selectedTarget;
  }

  /* submit Promotion Questionnaire from API */
  promoteTargetToScreen = async (newScreen) => {
    this.promoteTargetToScreenDisplayLoading = true;
    let res = null;

    // send to server
    try {
      res = await agent.Screen.create(newScreen);
      runInAction(() => {
        toast.success(
          "Successfully added a new screening series. Please navigate to view screens"
        );
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.rootStore.screenTStore.isTgScreenRegistryCacheValid = false;
        this.promoteTargetToScreenDisplayLoading = false;
      });
    }
    return res;
  };

  fetchTargetHistory = async () => {
    this.historyDisplayLoading = true;
    let id = this.selectedTarget.id;

    // first check cache
    let fetchedTargetHistory = this.targetHistoryRegistry.get(id);

    if (fetchedTargetHistory) {
      this.historyDisplayLoading = false;
      this.selectedTargetHistory = fetchedTargetHistory;
    }
    // if not found fetch from api
    else {
      try {
        fetchedTargetHistory = await agent.Target.history(id);
        runInAction(() => {
          this.targetHistoryRegistry.set(id, fetchedTargetHistory);
          this.selectedTargetHistory = fetchedTargetHistory;
        });
      } catch (error) {
        console.error(error);
      } finally {
        runInAction(() => {
          this.historyDisplayLoading = false;
        });
      }
    }
  };

  get targetHistory() {
    return this.selectedTargetHistory;
  }

  editTargetSummary = async () => {
    this.displayLoading = true;
    let updatedTarget = null;

    // send to server
    try {
      updatedTarget = await agent.Target.editSummary(this.selectedTarget);
      runInAction(() => {
        this.targetRegistryExpanded.delete(updatedTarget.id);
        this.fetchTarget(updatedTarget.id);
        toast.success("Saved");
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.displayLoading = false;
      });
    }
  };

  cancelEditTargetSummary = () => {
    this.selectedTarget = this.targetRegistryExpanded.get(
      this.selectedTarget.id
    );
  };

  editTargetPromotionInfo = async (targetPromotionInfoDTO) => {
    this.isEditingTargetPromotionInfo = true;
    let updatedTarget = null;

    // send to server
    try {
      updatedTarget = await agent.Target.editPromotionData(
        this.selectedTarget.id,
        targetPromotionInfoDTO
      );
      runInAction(() => {
        this.targetRegistryExpanded.delete(updatedTarget.id);
        this.fetchTarget(updatedTarget.id);
        toast.success("Saved");
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isEditingTargetPromotionInfo = false;
      });
    }
  };
}
