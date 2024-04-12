import { action, makeObservable, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import GeneUnpublishedStructuralInformationAPI from "../api/GeneUnpublishedStructuralInformationAPI";

export default class GeneUnpublishedStructuralInformationStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      isUpdatingUnpublishedStructuralInformation: observable,
      updateUnpublishedStructuralInformation: action,

      isAddingUnpublishedStructuralInformation: observable,
      addUnpublishedStructuralInformation: action,

      isDeletingUnpublishedStructuralInformation: observable,
      deleteUnpublishedStructuralInformation: action,
    });
  }

  // Observables
  isUpdatingUnpublishedStructuralInformation = false;
  isAddingUnpublishedStructuralInformation = false;
  isDeletingUnpublishedStructuralInformation = false;

  // Actions
  addUnpublishedStructuralInformation = async (
    unpublishedStructuralInformation
  ) => {
    this.isAddingUnpublishedStructuralInformation = true;

    // Ensure unpublishedStructuralInformation.geneId is set, fallback to selectedGene.geneId if null, undefined, or empty
    unpublishedStructuralInformation.geneId =
      unpublishedStructuralInformation.geneId?.trim() ||
      this.rootStore.geneStore.selectedGene.Id;

    try {
      var res = await GeneUnpublishedStructuralInformationAPI.create(
        unpublishedStructuralInformation
      );
      runInAction(() => {
        // Add unpublishedStructuralInformation to gene unpublishedStructuralInformation list
        unpublishedStructuralInformation.id = res.id;

        this.rootStore.geneStore.selectedGene.unpublishedStructuralInformations.push(
          unpublishedStructuralInformation
        );
        const gene = this.rootStore.geneStore.geneRegistry.get(
          unpublishedStructuralInformation.geneId
        );
        gene.unpublishedStructuralInformations.push(
          unpublishedStructuralInformation
        );

        toast.success(
          "Gene unpublishedStructuralInformation added successfully"
        );
      });
    } catch (error) {
      console.error(
        "Error adding gene unpublishedStructuralInformation:",
        error
      );
    } finally {
      runInAction(() => {
        this.isAddingUnpublishedStructuralInformation = false;
      });
    }
  };

  updateUnpublishedStructuralInformation = async (
    unpublishedStructuralInformation
  ) => {
    this.isUpdatingUnpublishedStructuralInformation = true;

    // Ensure unpublishedStructuralInformation.geneId is set, fallback to selectedGene.geneId if null, undefined, or empty
    unpublishedStructuralInformation.geneId =
      unpublishedStructuralInformation.geneId?.trim() ||
      this.rootStore.geneStore.selectedGene.id;

    // Ensure unpublishedStructuralInformation.id is not null, undefined, or empty
    if (!unpublishedStructuralInformation.id?.trim()) {
      throw new Error("id is required and cannot be empty.");
    }

    try {
      await GeneUnpublishedStructuralInformationAPI.update(
        unpublishedStructuralInformation
      );
      runInAction(() => {
        // update in gene registry list
        const gene = this.rootStore.geneStore.geneRegistry.get(
          unpublishedStructuralInformation.geneId
        );

        const indexOfEss = gene.unpublishedStructuralInformations.findIndex(
          (e) => e.id === unpublishedStructuralInformation.id
        );
        gene.unpublishedStructuralInformations[indexOfEss] =
          unpublishedStructuralInformation;

        // update the same in selected gene
        const selectedGene = this.rootStore.geneStore.selectedGene;
        const selectedIndex =
          selectedGene.unpublishedStructuralInformations.findIndex(
            (e) => e.id === unpublishedStructuralInformation.id
          );

        selectedGene.unpublishedStructuralInformations[selectedIndex] =
          unpublishedStructuralInformation;

        toast.success(
          "Gene unpublishedStructuralInformation updated successfully"
        );
      });
    } catch (error) {
      console.error(
        "Error updating gene unpublishedStructuralInformation:",
        error
      );
    } finally {
      runInAction(() => {
        this.isUpdatingUnpublishedStructuralInformation = false;
      });
    }
  };

  deleteUnpublishedStructuralInformation = async (id) => {
    this.isDeletingUnpublishedStructuralInformation = true;

    const geneId = this.rootStore.geneStore.selectedGene.id;

    // Ensure id is not null, undefined, or empty
    if (!id?.trim()) {
      throw new Error("id is required and cannot be empty.");
    }

    try {
      await GeneUnpublishedStructuralInformationAPI.delete(geneId, id);
      runInAction(() => {
        // remove unpublishedStructuralInformation from gene unpublishedStructuralInformation list
        const gene = this.rootStore.geneStore.geneRegistry.get(geneId);
        const indexOfEss = gene.unpublishedStructuralInformations.findIndex(
          (e) => e.id === id
        );
        gene.unpublishedStructuralInformations.splice(indexOfEss, 1);

        // remove the same from selected gene
        const selectedGene = this.rootStore.geneStore.selectedGene;
        const selectedIndex =
          selectedGene.unpublishedStructuralInformations.findIndex(
            (e) => e.id === id
          );
        selectedGene.unpublishedStructuralInformations.splice(selectedIndex, 1);

        toast.success(
          "Gene unpublishedStructuralInformation deleted successfully"
        );
      });
    } catch (error) {
      console.error(
        "Error deleting gene unpublishedStructuralInformation:",
        error
      );
    } finally {
      runInAction(() => {
        this.isDeletingUnpublishedStructuralInformation = false;
      });
    }
  };
}
