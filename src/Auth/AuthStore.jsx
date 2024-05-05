import { action, makeObservable, observable, runInAction } from "mobx";
import AuthApi from "./api/authApi";

export default class AuthStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      user: observable,
      isFetchingUser: observable,
      fetchUser: action,
      isOIDCLogged: observable,
      isUserValidated: observable,

      appVars: observable,
      globalValues: observable,

      fetchAppVars: action,
      fetchGlobalValues: action,

      isFetchingAppVars: observable,
      isFetchingGlobalValues: observable,
    });
  }

  // Observables
  user = null;
  isFetchingUser = false;
  isOIDCLogged = false;
  isUserValidated = false;

  appVars = null;
  globalValues = null;
  isFetchingAppVars = false;
  isFetchingGlobalValues = false;

  // Actions

  fetchUser = async () => {
    this.isFetchingUser = true;
    try {
      const user = await AuthApi.validate();
      runInAction(() => {
        //console.log("AuthStore -> fetchUser -> user", user);
        this.user = user;
        this.isUserValidated = true;
      });
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      runInAction(() => {
        this.isFetchingUser = false;
      });
    }
  };

  fetchAppVars = async () => {
    this.isFetchingAppVars = true;
    try {
      const appVars = await AuthApi.getAppVars();
      runInAction(() => {
        this.appVars = appVars;
      });
    } catch (error) {
      console.error("Error fetching app vars:", error);
    } finally {
      runInAction(() => {
        this.isFetchingAppVars = false;
      });
    }
  };

  fetchGlobalValues = async () => {
    this.isFetchingGlobalValues = true;
    try {
      const globalValues = await AuthApi.getGlobalValues();
      runInAction(() => {
        this.globalValues = globalValues;
      });
    } catch (error) {
      console.error("Error fetching global values:", error);
    } finally {
      runInAction(() => {
        this.isFetchingGlobalValues = false;
      });
    }
  };
}
