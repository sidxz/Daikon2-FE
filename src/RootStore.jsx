import { configure } from "mobx";
import { createContext } from "react";
import GeneEssentialityStore from "./Apps/Flow/FlowGene/Stores/GeneEssentialityStore";
import GenePDBCrossRefStore from "./Apps/Flow/FlowGene/Stores/GenePDBCrossRefStore";
import GeneProteinProductionStore from "./Apps/Flow/FlowGene/Stores/GeneProteinProductionStore";
import GeneStore from "./Apps/Flow/FlowGene/Stores/GeneStore";
import AuthStore from "./Auth/AuthStore";

configure({ enforceActions: "always" });

export class RootStore {
  // Stores

  authStore;

  geneStore;
  genePDBCrossRefStore;
  geneEssentialityStore;
  geneProteinProductionStore;
  constructor() {
    this.authStore = new AuthStore(this);
    this.geneStore = new GeneStore(this);
    this.genePDBCrossRefStore = new GenePDBCrossRefStore(this);
    this.geneEssentialityStore = new GeneEssentialityStore(this);
    this.geneProteinProductionStore = new GeneProteinProductionStore(this);
  }
}

export const RootStoreContext = createContext(new RootStore());