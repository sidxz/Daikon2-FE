import { action, computed, makeObservable, observable } from "mobx";

export default class GeneEssentialityStore {
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
}
