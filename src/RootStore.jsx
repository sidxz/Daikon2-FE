import { configure } from "mobx";
import { createContext } from "react";
import GeneStore from "./Apps/Flow/FlowGene/store/GeneStore";
import AuthStore from "./Auth/AuthStore";

configure({ enforceActions: "always" });

export class RootStore {
  // Stores

  authStore;
  geneStore;
  constructor() {
    this.authStore = new AuthStore(this);
    this.geneStore = new GeneStore(this);
  }
}

export const RootStoreContext = createContext(new RootStore());
