import { action, makeObservable, observable } from "mobx";
import AuthApi from "./api/authApi";

export default class AuthStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      user: observable,
      isFetchingUser: observable,
      fetchUser: action,
      loginFlow: action,
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
      console.log("User From Auth Store:", user);
      this.user = user;
    } catch (error) {
      console.error("Error fetching user:", error);
    }
    this.isFetchingUser = false;
  };

  loginFlow = async () => {
    console.log("Login flow");
    // Do login
  };
}
