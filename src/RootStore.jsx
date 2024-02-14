import { configure } from "mobx";
import { createContext } from "react";
import GenePDBCrossRefStore from "./Apps/Flow/FlowGene/store/GenePDBCrossRefStore";
import GeneStore from "./Apps/Flow/FlowGene/store/GeneStore";
import AuthStore from "./Auth/AuthStore";

configure({ enforceActions: "always" });

export class RootStore {
  // Stores

  authStore;
  geneStore;
  genePDBCrossRefStore;
  constructor() {
    this.authStore = new AuthStore(this);
    this.geneStore = new GeneStore(this);
    this.genePDBCrossRefStore = new GenePDBCrossRefStore(this);
  }
}

export const RootStoreContext = createContext(new RootStore());
