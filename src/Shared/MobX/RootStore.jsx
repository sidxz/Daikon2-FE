import { configure } from "mobx";
import { createContext } from "react";
import AuthStore from "../../Auth/AuthStore";

// Enforcing that all state changes are done through actions
configure({ enforceActions: "always" });

export class RootStore {
  // Store instances
  authStore;

  constructor() {
    this.authStore = new AuthStore(this);
  }
}

export const RootStoreContext = createContext(new RootStore());
