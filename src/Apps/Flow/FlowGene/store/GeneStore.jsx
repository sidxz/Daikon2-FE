import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import GeneAPI from "../api/GeneAPI";

export default class GeneStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      geneList: computed,
      isFetchingGenes: observable,
      fetchGenes: action,
      geneListRegistry: observable,
      isGeneListCacheValid: observable,
      availableGeneFunctionalCategories: observable,
    });
  }

  // Observables
  isFetchingGenes = false;
  isGeneListCacheValid = false;
  geneListRegistry = new Map();
  availableGeneFunctionalCategories = new Set();

  // Actions

  fetchGenes = async (inValidateCache = false) => {
    if (inValidateCache) {
      this.isGeneListCacheValid = false;
    }
    if (this.isGeneListCacheValid) {
      return;
    }
    this.isFetchingGenes = true;
    try {
      const genes = await GeneAPI.list();
      runInAction(() => {
        genes.forEach((gene) => {
          this.geneListRegistry.set(gene.id, gene);
          this.availableGeneFunctionalCategories.add(gene.functionalCategory);
        });
        this.isGeneListCacheValid = true;
      });
    } catch (error) {
      console.error("Error fetching genes:", error);
    } finally {
      runInAction(() => {
        this.isFetchingGenes = false;
      });
    }
  };

  get geneList() {
    return Array.from(this.geneListRegistry.values());
  }
}
