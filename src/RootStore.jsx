import { configure } from "mobx";
import { createContext } from "react";
import AuthStore from "./Auth/AuthStore";

configure({ enforceActions: "always" });

export class RootStore {
  // Stores

  authStore;
  constructor() {
    this.authStore = new AuthStore(this);
  }
}

export const RootStoreContext = createContext(new RootStore());
