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

      fetchGene: action,
      isFetchingGene: observable,
      geneRegistry: observable,
      isGeneRegistryCacheValid: observable,
      selectedGene: observable,
    });
  }

  // Observables
  isFetchingGenes = false;
  isGeneListCacheValid = false;
  geneListRegistry = new Map();
  availableGeneFunctionalCategories = new Set();

  isFetchingGene = false;
  geneRegistry = new Map();
  isGeneRegistryCacheValid = false;
  selectedGene = null;

  // Actions

  fetchGenes = async (inValidateCache = false) => {
    if (inValidateCache) {
      this.isGeneListCacheValid = false;
    }
    if (this.isGeneListCacheValid || this.isFetchingGenes) {
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

  fetchGene = async (geneId, inValidateCache = false) => {
    if (inValidateCache) {
      this.isGeneRegistryCacheValid = false;
    }
    // short circuit multiple requests
    if (this.isFetchingGene) {
      return;
    }

    this.isFetchingGene = true;
    if (this.isGeneRegistryCacheValid) {
      // find gene in registry and return if found
      const gene = this.geneRegistry.get(geneId);
      if (gene) {
        this.isFetchingGene = false;
        this.selectedGene = gene;
      }
    }
    try {
      const gene = await GeneAPI.getById(geneId);
      runInAction(() => {
        this.geneRegistry.set(gene.id, gene);
        this.isGeneRegistryCacheValid = true;
        this.selectedGene = gene;
      });
    } catch (error) {
      console.error("Error fetching gene:", error);
    } finally {
      runInAction(() => {
        this.isFetchingGene = false;
      });
    }
  };
}
