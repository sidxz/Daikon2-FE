import { action, makeObservable, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import GeneCrispriStrainAPI from "../api/GeneCrispriStrainAPI";

export default class GeneCrispriStrainStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      isUpdatingCrispriStrain: observable,
      updateCrispriStrain: action,

      isAddingCrispriStrain: observable,
      addCrispriStrain: action,

      isDeletingCrispriStrain: observable,
      deleteCrispriStrain: action,
    });
  }

  // Observables
  isUpdatingCrispriStrain = false;
  isAddingCrispriStrain = false;
  isDeletingCrispriStrain = false;

  // Actions
  addCrispriStrain = async (crispriStrain) => {
    this.isAddingCrispriStrain = true;

    // Ensure crispriStrain.geneId is set, fallback to selectedGene.geneId if null, undefined, or empty
    crispriStrain.geneId =
      crispriStrain.geneId?.trim() || this.rootStore.geneStore.selectedGene.Id;

    try {
      var res = await GeneCrispriStrainAPI.create(crispriStrain);
      runInAction(() => {
        // Add crispriStrain to gene crispriStrain list
        crispriStrain.crispriStrainId = res.id;

        this.rootStore.geneStore.selectedGene.crispriStrains.push(
          crispriStrain
        );
        const gene = this.rootStore.geneStore.geneRegistry.get(
          crispriStrain.geneId
        );
        gene.crispriStrains.push(crispriStrain);

        toast.success("Gene crispriStrain added successfully");
      });
    } catch (error) {
      console.error("Error adding gene crispriStrain:", error);
    } finally {
      runInAction(() => {
        this.isAddingCrispriStrain = false;
      });
    }
  };

  updateCrispriStrain = async (crispriStrain) => {
    this.isUpdatingCrispriStrain = true;

    // Ensure crispriStrain.geneId is set, fallback to selectedGene.geneId if null, undefined, or empty
    crispriStrain.geneId =
      crispriStrain.geneId?.trim() || this.rootStore.geneStore.selectedGene.id;

    // Ensure crispriStrain.crispriStrainId is not null, undefined, or empty
    if (!crispriStrain.crispriStrainId?.trim()) {
      throw new Error("crispriStrainId is required and cannot be empty.");
    }

    try {
      await GeneCrispriStrainAPI.update(crispriStrain);
      runInAction(() => {
        // update in gene registry list
        const gene = this.rootStore.geneStore.geneRegistry.get(
          crispriStrain.geneId
        );

        const indexOfEss = gene.crispriStrains.findIndex(
          (e) => e.crispriStrainId === crispriStrain.crispriStrainId
        );
        gene.crispriStrains[indexOfEss] = crispriStrain;

        // update the same in selected gene
        const selectedGene = this.rootStore.geneStore.selectedGene;
        const selectedIndex = selectedGene.crispriStrains.findIndex(
          (e) => e.crispriStrainId === crispriStrain.crispriStrainId
        );

        selectedGene.crispriStrains[selectedIndex] = crispriStrain;

        toast.success("Gene crispriStrain updated successfully");
      });
    } catch (error) {
      console.error("Error updating gene crispriStrain:", error);
    } finally {
      runInAction(() => {
        this.isUpdatingCrispriStrain = false;
      });
    }
  };

  deleteCrispriStrain = async (crispriStrainId) => {
    this.isDeletingCrispriStrain = true;

    const geneId = this.rootStore.geneStore.selectedGene.id;

    // Ensure crispriStrainId is not null, undefined, or empty
    if (!crispriStrainId?.trim()) {
      throw new Error("crispriStrainId is required and cannot be empty.");
    }

    try {
      await GeneCrispriStrainAPI.delete(geneId, crispriStrainId);
      runInAction(() => {
        // remove crispriStrain from gene crispriStrain list
        const gene = this.rootStore.geneStore.geneRegistry.get(geneId);
        const indexOfEss = gene.crispriStrains.findIndex(
          (e) => e.crispriStrainId === crispriStrainId
        );
        gene.crispriStrains.splice(indexOfEss, 1);

        // remove the same from selected gene
        const selectedGene = this.rootStore.geneStore.selectedGene;
        const selectedIndex = selectedGene.crispriStrains.findIndex(
          (e) => e.crispriStrainId === crispriStrainId
        );
        selectedGene.crispriStrains.splice(selectedIndex, 1);

        toast.success("Gene crispriStrain deleted successfully");
      });
    } catch (error) {
      console.error("Error deleting gene crispriStrain:", error);
    } finally {
      runInAction(() => {
        this.isDeletingCrispriStrain = false;
      });
    }
  };
}
