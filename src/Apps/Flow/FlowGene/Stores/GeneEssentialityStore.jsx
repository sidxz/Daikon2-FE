import { action, makeObservable, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import GeneEssentialityAPI from "../api/GeneEssentialityAPI";

export default class GeneEssentialityStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      isUpdatingEssentiality: observable,
      updateEssentiality: action,

      isAddingEssentiality: observable,
      addEssentiality: action,
    });
  }

  // Observables
  isUpdatingEssentiality = false;
  isAddingEssentiality = false;

  // Actions
  addEssentiality = async (essentiality) => {
    this.isAddingEssentiality = true;

    // Ensure essentiality.geneId is set, fallback to selectedGene.geneId if null, undefined, or empty
    essentiality.geneId =
      essentiality.geneId?.trim() || this.rootStore.geneStore.selectedGene.Id;

    try {
      await GeneEssentialityAPI.create(essentiality);
      runInAction(() => {
        // Add essentiality to gene essentiality list
        this.rootStore.geneStore.selectedGene.essentialities.push(essentiality);
        const gene = this.rootStore.geneStore.geneRegistry.get(
          essentiality.geneId
        );
        gene.essentialities.push(essentiality);

        toast.success("Gene essentiality added successfully");
      });
    } catch (error) {
      console.error("Error adding gene essentiality:", error);
    } finally {
      runInAction(() => {
        this.isAddingEssentiality = false;
      });
    }
  };

  updateEssentiality = async (essentiality) => {
    this.isUpdatingEssentiality = true;

    // Ensure essentiality.geneId is set, fallback to selectedGene.geneId if null, undefined, or empty
    essentiality.geneId =
      essentiality.geneId?.trim() || this.rootStore.geneStore.selectedGene.id;

    // Ensure essentiality.essentialityId is not null, undefined, or empty
    if (!essentiality.essentialityId?.trim()) {
      throw new Error("essentialityId is required and cannot be empty.");
    }

    try {
      await GeneEssentialityAPI.update(essentiality);
      runInAction(() => {
        // update in gene registry list
        const gene = this.rootStore.geneStore.geneRegistry.get(
          essentiality.geneId
        );

        const indexOfEss = gene.essentialities.findIndex(
          (e) => e.essentialityId === essentiality.essentialityId
        );
        gene.essentialities[indexOfEss] = essentiality;

        // update the same in selected gene
        const selectedGene = this.rootStore.geneStore.selectedGene;
        const selectedIndex = selectedGene.essentialities.findIndex(
          (e) => e.essentialityId === essentiality.essentialityId
        );

        selectedGene.essentialities[selectedIndex] = essentiality;

        toast.success("Gene essentiality updated successfully");
      });
    } catch (error) {
      console.error("Error updating gene essentiality:", error);
    } finally {
      runInAction(() => {
        this.isUpdatingEssentiality = false;
      });
    }
  };
}
