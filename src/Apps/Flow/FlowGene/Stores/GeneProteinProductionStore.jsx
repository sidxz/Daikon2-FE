import { action, makeObservable, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import GeneProteinProductionAPI from "../api/GeneProteinProductionAPI";

export default class GeneProteinProductionStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      isUpdatingProteinProduction: observable,
      updateProteinProduction: action,

      isAddingProteinProduction: observable,
      addProteinProduction: action,

      isDeletingProteinProduction: observable,
      deleteProteinProduction: action,
    });
  }

  // Observables
  isUpdatingProteinProduction = false;
  isAddingProteinProduction = false;
  isDeletingProteinProduction = false;

  // Actions
  addProteinProduction = async (proteinProduction) => {
    this.isAddingProteinProduction = true;

    // Ensure proteinProduction.geneId is set, fallback to selectedGene.geneId if null, undefined, or empty
    proteinProduction.geneId =
      proteinProduction.geneId?.trim() || this.rootStore.geneStore.selectedGene.Id;

    try {
      var res = await GeneProteinProductionAPI.create(proteinProduction);
      runInAction(() => {
        // Add proteinProduction to gene proteinProduction list
        console.log(res);
        proteinProduction.proteinProductionId = res.id;

        console.log("Add with iD proteinProduction:", proteinProduction);
        this.rootStore.geneStore.selectedGene.proteinProductions.push(proteinProduction);
        const gene = this.rootStore.geneStore.geneRegistry.get(
          proteinProduction.geneId
        );
        gene.proteinProductions.push(proteinProduction);

        toast.success("Gene proteinProduction added successfully");
      });
    } catch (error) {
      console.error("Error adding gene proteinProduction:", error);
    } finally {
      runInAction(() => {
        this.isAddingProteinProduction = false;
      });
    }
  };

  updateProteinProduction = async (proteinProduction) => {
    console.log("updateProteinProduction:", proteinProduction);
    this.isUpdatingProteinProduction = true;

    // Ensure proteinProduction.geneId is set, fallback to selectedGene.geneId if null, undefined, or empty
    proteinProduction.geneId =
      proteinProduction.geneId?.trim() || this.rootStore.geneStore.selectedGene.id;

    // Ensure proteinProduction.proteinProductionId is not null, undefined, or empty
    if (!proteinProduction.proteinProductionId?.trim()) {
      throw new Error("proteinProductionId is required and cannot be empty.");
    }

    try {
      await GeneProteinProductionAPI.update(proteinProduction);
      runInAction(() => {
        // update in gene registry list
        const gene = this.rootStore.geneStore.geneRegistry.get(
          proteinProduction.geneId
        );

        const indexOfEss = gene.proteinProductions.findIndex(
          (e) => e.proteinProductionId === proteinProduction.proteinProductionId
        );
        gene.proteinProductions[indexOfEss] = proteinProduction;

        // update the same in selected gene
        const selectedGene = this.rootStore.geneStore.selectedGene;
        const selectedIndex = selectedGene.proteinProductions.findIndex(
          (e) => e.proteinProductionId === proteinProduction.proteinProductionId
        );

        selectedGene.proteinProductions[selectedIndex] = proteinProduction;

        toast.success("Gene proteinProduction updated successfully");
      });
    } catch (error) {
      console.error("Error updating gene proteinProduction:", error);
    } finally {
      runInAction(() => {
        this.isUpdatingProteinProduction = false;
      });
    }
  };

  deleteProteinProduction = async (proteinProductionId) => {
    this.isDeletingProteinProduction = true;

    const geneId = this.rootStore.geneStore.selectedGene.id;

    // Ensure proteinProductionId is not null, undefined, or empty
    if (!proteinProductionId?.trim()) {
      throw new Error("proteinProductionId is required and cannot be empty.");
    }

    try {
      await GeneProteinProductionAPI.delete(geneId, proteinProductionId);
      runInAction(() => {
        // remove proteinProduction from gene proteinProduction list
        const gene = this.rootStore.geneStore.geneRegistry.get(geneId);
        const indexOfEss = gene.proteinProductions.findIndex(
          (e) => e.proteinProductionId === proteinProductionId
        );
        gene.proteinProductions.splice(indexOfEss, 1);

        // remove the same from selected gene
        const selectedGene = this.rootStore.geneStore.selectedGene;
        const selectedIndex = selectedGene.proteinProductions.findIndex(
          (e) => e.proteinProductionId === proteinProductionId
        );
        selectedGene.proteinProductions.splice(selectedIndex, 1);

        toast.success("Gene proteinProduction deleted successfully");
      });
    } catch (error) {
      console.error("Error deleting gene proteinProduction:", error);
    } finally {
      runInAction(() => {
        this.isDeletingProteinProduction = false;
      });
    }
  };
}
