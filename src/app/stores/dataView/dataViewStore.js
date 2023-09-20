import { action, makeObservable, observable, runInAction } from "mobx";

import agent from "../../api/agent";

export default class DataViewStore {
  rootStore;

  loadingTargetDash = false;
  targetDash = null;
  screenDash = null;
  haDash = null;

  fetchingLatestDiscussions = false;
  latestDiscussions = [];

  isLoadingScreenDash = false;
  isLoadingHaDash = false;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      loadingTargetDash: observable,
      targetDash: observable,
      loadTargetDash: action,

      fetchLatestDiscussions: action,
      fetchingLatestDiscussions: observable,
      latestDiscussions: observable,

      isLoadingScreenDash: observable,
      screenDash: observable,
      loadScreenDash: action,

      isLoadingHaDash: observable,
      haDash: observable,
      loadHaDash: action,
    });
  }

  loadTargetDash = async () => {
    this.loadingTargetDash = true;

    if (this.targetDash === null) {
      try {
        this.targetDash = await agent.DataView.targetDash();
      } catch (error) {
        this.targetDash = null;
        console.error(error);
      } finally {
        runInAction(() => {
          this.loadingTargetDash = false;
        });
      }
    } else {
      this.loadingTargetDash = false;
    }
  };

  fetchLatestDiscussions = async () => {
    this.fetchingLatestDiscussions = true;
    try {
      this.latestDiscussions = await agent.DataView.latestDiscussions();
    } catch (error) {
      console.err(error);
    } finally {
      runInAction(() => {
        this.fetchingLatestDiscussions = false;
      });
    }
  };

  loadScreenDash = async () => {
    this.isLoadingScreenDash = true;
    try {
      this.screenDash = await agent.DataView.screenDash();
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isLoadingScreenDash = false;
      });
    }
  };

  loadHaDash = async () => {
    this.isLoadingHaDash = true;
    try {
      this.haDash = await agent.DataView.haDash();
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isLoadingHaDash = false;
      });
    }
  };
}
