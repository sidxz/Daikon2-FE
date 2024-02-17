import { action, makeObservable, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import GeneResistanceMutationAPI from "../api/GeneResistanceMutationAPI";

export default class GeneResistanceMutationStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      isUpdatingResistanceMutation: observable,
      updateResistanceMutation: action,

      isAddingResistanceMutation: observable,
      addResistanceMutation: action,

      isDeletingResistanceMutation: observable,
      deleteResistanceMutation: action,
    });
  }

  // Observables
  isUpdatingResistanceMutation = false;
  isAddingResistanceMutation = false;
  isDeletingResistanceMutation = false;

  // Actions
  addResistanceMutation = async (resistanceMutation) => {
    this.isAddingResistanceMutation = true;

    // Ensure resistanceMutation.geneId is set, fallback to selectedGene.geneId if null, undefined, or empty
    resistanceMutation.geneId =
      resistanceMutation.geneId?.trim() ||
      this.rootStore.geneStore.selectedGene.Id;

    try {
      var res = await GeneResistanceMutationAPI.create(resistanceMutation);
      runInAction(() => {
        // Add resistanceMutation to gene resistanceMutation list
        console.log(res);
        resistanceMutation.resistanceMutationId = res.id;

        console.log("Add with ID resistanceMutation:", resistanceMutation);
        this.rootStore.geneStore.selectedGene.resistanceMutations.push(
          resistanceMutation
        );
        const gene = this.rootStore.geneStore.geneRegistry.get(
          resistanceMutation.geneId
        );
        gene.resistanceMutations.push(resistanceMutation);

        toast.success("Gene resistanceMutation added successfully");
      });
    } catch (error) {
      console.error("Error adding gene resistanceMutation:", error);
    } finally {
      runInAction(() => {
        this.isAddingResistanceMutation = false;
      });
    }
  };

  updateResistanceMutation = async (resistanceMutation) => {
    console.log("updateResistanceMutation:", resistanceMutation);
    this.isUpdatingResistanceMutation = true;

    // Ensure resistanceMutation.geneId is set, fallback to selectedGene.geneId if null, undefined, or empty
    resistanceMutation.geneId =
      resistanceMutation.geneId?.trim() ||
      this.rootStore.geneStore.selectedGene.id;

    // Ensure resistanceMutation.resistanceMutationId is not null, undefined, or empty
    if (!resistanceMutation.resistanceMutationId?.trim()) {
      throw new Error("resistanceMutationId is required and cannot be empty.");
    }

    try {
      await GeneResistanceMutationAPI.update(resistanceMutation);
      runInAction(() => {
        // update in gene registry list
        const gene = this.rootStore.geneStore.geneRegistry.get(
          resistanceMutation.geneId
        );

        const indexOfEss = gene.resistanceMutations.findIndex(
          (e) =>
            e.resistanceMutationId === resistanceMutation.resistanceMutationId
        );
        gene.resistanceMutations[indexOfEss] = resistanceMutation;

        // update the same in selected gene
        const selectedGene = this.rootStore.geneStore.selectedGene;
        const selectedIndex = selectedGene.resistanceMutations.findIndex(
          (e) =>
            e.resistanceMutationId === resistanceMutation.resistanceMutationId
        );

        selectedGene.resistanceMutations[selectedIndex] = resistanceMutation;

        toast.success("Gene resistanceMutation updated successfully");
      });
    } catch (error) {
      console.error("Error updating gene resistanceMutation:", error);
    } finally {
      runInAction(() => {
        this.isUpdatingResistanceMutation = false;
      });
    }
  };

  deleteResistanceMutation = async (resistanceMutationId) => {
    this.isDeletingResistanceMutation = true;

    const geneId = this.rootStore.geneStore.selectedGene.id;

    // Ensure resistanceMutationId is not null, undefined, or empty
    if (!resistanceMutationId?.trim()) {
      throw new Error("resistanceMutationId is required and cannot be empty.");
    }

    try {
      await GeneResistanceMutationAPI.delete(geneId, resistanceMutationId);
      runInAction(() => {
        // remove resistanceMutation from gene resistanceMutation list
        const gene = this.rootStore.geneStore.geneRegistry.get(geneId);
        const indexOfEss = gene.resistanceMutations.findIndex(
          (e) => e.resistanceMutationId === resistanceMutationId
        );
        gene.resistanceMutations.splice(indexOfEss, 1);

        // remove the same from selected gene
        const selectedGene = this.rootStore.geneStore.selectedGene;
        const selectedIndex = selectedGene.resistanceMutations.findIndex(
          (e) => e.resistanceMutationId === resistanceMutationId
        );
        selectedGene.resistanceMutations.splice(selectedIndex, 1);

        toast.success("Gene resistanceMutation deleted successfully");
      });
    } catch (error) {
      console.error("Error deleting gene resistanceMutation:", error);
    } finally {
      runInAction(() => {
        this.isDeletingResistanceMutation = false;
      });
    }
  };
}
