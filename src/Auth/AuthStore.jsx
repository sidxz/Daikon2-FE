import { action, makeObservable, observable, runInAction } from "mobx";
import AuthApi from "./api/authApi";

export default class AuthStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      user: observable,
      userFetchServerError: observable,
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
  // "HTTP 502" / "no response" when the user check failed because of the server,
  // so the UI doesn't report that as an inactive account
  userFetchServerError = null;
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
    this.userFetchServerError = null;
    try {
      const user = await AuthApi.validate();
      runInAction(() => {
        //console.log("AuthStore -> fetchUser -> user", user);
        this.user = user;
        this.isUserValidated = true;
        this.userFetchServerError = null;
      });
    } catch (error) {
      // Message only: the error's config carries the Authorization header
      console.error("Error fetching user:", error?.message ?? error);
      // No response or a 5xx means the server failed. 4xx (401/404: not a DAIKON
      // user or locked) and cancelled duplicate GETs keep the "inactive" path.
      const status = error?.response?.status;
      if (
        status >= 500 ||
        ["ERR_NETWORK", "ECONNABORTED", "ETIMEDOUT"].includes(error?.code)
      ) {
        runInAction(() => {
          this.userFetchServerError = status ? `HTTP ${status}` : "no response";
        });
      }
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
