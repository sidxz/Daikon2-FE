import { action, makeObservable, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import GeneProteinActivityAssayAPI from "../api/GeneProteinActivityAssayAPI";

export default class GeneProteinActivityAssayStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      isUpdatingProteinActivityAssay: observable,
      updateProteinActivityAssay: action,

      isAddingProteinActivityAssay: observable,
      addProteinActivityAssay: action,

      isDeletingProteinActivityAssay: observable,
      deleteProteinActivityAssay: action,
    });
  }

  // Observables
  isUpdatingProteinActivityAssay = false;
  isAddingProteinActivityAssay = false;
  isDeletingProteinActivityAssay = false;

  // Actions
  addProteinActivityAssay = async (proteinActivityAssay) => {
    this.isAddingProteinActivityAssay = true;

    // Ensure proteinActivityAssay.geneId is set, fallback to selectedGene.geneId if null, undefined, or empty
    proteinActivityAssay.geneId =
      proteinActivityAssay.geneId?.trim() ||
      this.rootStore.geneStore.selectedGene.Id;

    try {
      var res = await GeneProteinActivityAssayAPI.create(proteinActivityAssay);
      runInAction(() => {
        // Add proteinActivityAssay to gene proteinActivityAssay list
        proteinActivityAssay.proteinActivityAssayId = res.id;

        this.rootStore.geneStore.selectedGene.proteinActivityAssays.push(
          proteinActivityAssay
        );
        const gene = this.rootStore.geneStore.geneRegistry.get(
          proteinActivityAssay.geneId
        );
        gene.proteinActivityAssays.push(proteinActivityAssay);

        toast.success("Gene proteinActivityAssay added successfully");
      });
    } catch (error) {
      console.error("Error adding gene proteinActivityAssay:", error);
    } finally {
      runInAction(() => {
        this.isAddingProteinActivityAssay = false;
      });
    }
  };

  updateProteinActivityAssay = async (proteinActivityAssay) => {
    this.isUpdatingProteinActivityAssay = true;

    // Ensure proteinActivityAssay.geneId is set, fallback to selectedGene.geneId if null, undefined, or empty
    proteinActivityAssay.geneId =
      proteinActivityAssay.geneId?.trim() ||
      this.rootStore.geneStore.selectedGene.id;

    // Ensure proteinActivityAssay.proteinActivityAssayId is not null, undefined, or empty
    if (!proteinActivityAssay.proteinActivityAssayId?.trim()) {
      throw new Error(
        "proteinActivityAssayId is required and cannot be empty."
      );
    }

    try {
      await GeneProteinActivityAssayAPI.update(proteinActivityAssay);
      runInAction(() => {
        // update in gene registry list
        const gene = this.rootStore.geneStore.geneRegistry.get(
          proteinActivityAssay.geneId
        );

        const indexOfEss = gene.proteinActivityAssays.findIndex(
          (e) =>
            e.proteinActivityAssayId ===
            proteinActivityAssay.proteinActivityAssayId
        );
        gene.proteinActivityAssays[indexOfEss] = proteinActivityAssay;

        // update the same in selected gene
        const selectedGene = this.rootStore.geneStore.selectedGene;
        const selectedIndex = selectedGene.proteinActivityAssays.findIndex(
          (e) =>
            e.proteinActivityAssayId ===
            proteinActivityAssay.proteinActivityAssayId
        );

        selectedGene.proteinActivityAssays[selectedIndex] =
          proteinActivityAssay;

        toast.success("Gene proteinActivityAssay updated successfully");
      });
    } catch (error) {
      console.error("Error updating gene proteinActivityAssay:", error);
    } finally {
      runInAction(() => {
        this.isUpdatingProteinActivityAssay = false;
      });
    }
  };

  deleteProteinActivityAssay = async (proteinActivityAssayId) => {
    this.isDeletingProteinActivityAssay = true;

    const geneId = this.rootStore.geneStore.selectedGene.id;

    // Ensure proteinActivityAssayId is not null, undefined, or empty
    if (!proteinActivityAssayId?.trim()) {
      throw new Error(
        "proteinActivityAssayId is required and cannot be empty."
      );
    }

    try {
      await GeneProteinActivityAssayAPI.delete(geneId, proteinActivityAssayId);
      runInAction(() => {
        // remove proteinActivityAssay from gene proteinActivityAssay list
        const gene = this.rootStore.geneStore.geneRegistry.get(geneId);
        const indexOfEss = gene.proteinActivityAssays.findIndex(
          (e) => e.proteinActivityAssayId === proteinActivityAssayId
        );
        gene.proteinActivityAssays.splice(indexOfEss, 1);

        // remove the same from selected gene
        const selectedGene = this.rootStore.geneStore.selectedGene;
        const selectedIndex = selectedGene.proteinActivityAssays.findIndex(
          (e) => e.proteinActivityAssayId === proteinActivityAssayId
        );
        selectedGene.proteinActivityAssays.splice(selectedIndex, 1);

        toast.success("Gene proteinActivityAssay deleted successfully");
      });
    } catch (error) {
      console.error("Error deleting gene proteinActivityAssay:", error);
    } finally {
      runInAction(() => {
        this.isDeletingProteinActivityAssay = false;
      });
    }
  };
}
