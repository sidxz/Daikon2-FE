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
    });
  }

  // Observables
  user = null;
  isFetchingUser = false;
  isOIDCLogged = false;
  isUserValidated = false;

  // Actions

  fetchUser = async () => {
    this.isFetchingUser = true;
    try {
      const user = await AuthApi.validate();
      runInAction(() => {
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
}
