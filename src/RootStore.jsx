import { configure } from "mobx";
import { createContext } from "react";
import GeneCrispriStrainStore from "./Apps/Flow/FlowGene/Stores/GeneCrispriStrainStore";
import GeneEssentialityStore from "./Apps/Flow/FlowGene/Stores/GeneEssentialityStore";
import GeneHypomorphStore from "./Apps/Flow/FlowGene/Stores/GeneHypomorphStore";
import GenePDBCrossRefStore from "./Apps/Flow/FlowGene/Stores/GenePDBCrossRefStore";
import GeneProteinActivityAssayStore from "./Apps/Flow/FlowGene/Stores/GeneProteinActivityAssayStore";
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
  geneProteinActivityAssayStore;
  geneHypomorphStore;
  geneCrispriStrainStore;
  constructor() {
    this.authStore = new AuthStore(this);
    this.geneStore = new GeneStore(this);
    this.genePDBCrossRefStore = new GenePDBCrossRefStore(this);
    this.geneEssentialityStore = new GeneEssentialityStore(this);
    this.geneProteinProductionStore = new GeneProteinProductionStore(this);
    this.geneProteinActivityAssayStore = new GeneProteinActivityAssayStore(
      this
    );
    this.geneHypomorphStore = new GeneHypomorphStore(this);
    this.geneCrispriStrainStore = new GeneCrispriStrainStore(this);
  }
}

export const RootStoreContext = createContext(new RootStore());
