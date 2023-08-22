import { action, makeObservable, observable, runInAction } from "mobx";
import agent from "../../api/agent";
export default class TargetPTDataManagement {
  rootStore;

  targetScorecardExports = new Array();
  isExporting = false;
  isImporting = false;

  importDataResponse = new Array();

  constructor(rootStore) {
    this.rootStore = rootStore;

    makeObservable(this, {
      isExporting: observable,
      exportData: action,
      targetScorecardExports: observable,

      isImporting: observable,
      importData: action,
      importDataResponse: observable,
    });
  }

  exportData = async () => {
    this.isExporting = true;
    try {
      let res = await agent.TargetPromotionToolDataManagement.exportData();
      runInAction(() => {
        this.targetScorecardExports = res;
        return res;
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isExporting = false;
      });
    }
  };

  importData = async (data) => {
    this.isImporting = true;

    try {
      let res = await agent.TargetPromotionToolDataManagement.importData(data);

      runInAction(() => {
        //this.exportData();
        this.importDataResponse = res;
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isImporting = false;
      });
    }
  };
}
