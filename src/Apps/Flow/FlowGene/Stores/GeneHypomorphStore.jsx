import { action, makeObservable, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import GeneHypomorphAPI from "../api/GeneHypomorphAPI";

export default class GeneHypomorphStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      isUpdatingHypomorph: observable,
      updateHypomorph: action,

      isAddingHypomorph: observable,
      addHypomorph: action,

      isDeletingHypomorph: observable,
      deleteHypomorph: action,
    });
  }

  // Observables
  isUpdatingHypomorph = false;
  isAddingHypomorph = false;
  isDeletingHypomorph = false;

  // Actions
  addHypomorph = async (hypomorph) => {
    this.isAddingHypomorph = true;

    // Ensure hypomorph.geneId is set, fallback to selectedGene.geneId if null, undefined, or empty
    hypomorph.geneId =
      hypomorph.geneId?.trim() || this.rootStore.geneStore.selectedGene.Id;

    try {
      var res = await GeneHypomorphAPI.create(hypomorph);
      runInAction(() => {
        // Add hypomorph to gene hypomorph list
        hypomorph.id = res.id;

        this.rootStore.geneStore.selectedGene.hypomorphs.push(hypomorph);
        const gene = this.rootStore.geneStore.geneRegistry.get(
          hypomorph.geneId
        );
        gene.hypomorphs.push(hypomorph);

        toast.success("Gene hypomorph added successfully");
      });
    } catch (error) {
      console.error("Error adding gene hypomorph:", error);
    } finally {
      runInAction(() => {
        this.isAddingHypomorph = false;
      });
    }
  };

  updateHypomorph = async (hypomorph) => {
    this.isUpdatingHypomorph = true;

    // Ensure hypomorph.geneId is set, fallback to selectedGene.geneId if null, undefined, or empty
    hypomorph.geneId =
      hypomorph.geneId?.trim() || this.rootStore.geneStore.selectedGene.id;

    // Ensure hypomorph.id is not null, undefined, or empty
    if (!hypomorph.id?.trim()) {
      throw new Error("id is required and cannot be empty.");
    }

    try {
      await GeneHypomorphAPI.update(hypomorph);
      runInAction(() => {
        // update in gene registry list
        const gene = this.rootStore.geneStore.geneRegistry.get(
          hypomorph.geneId
        );

        const indexOfEss = gene.hypomorphs.findIndex(
          (e) => e.id === hypomorph.id
        );
        gene.hypomorphs[indexOfEss] = hypomorph;

        // update the same in selected gene
        const selectedGene = this.rootStore.geneStore.selectedGene;
        const selectedIndex = selectedGene.hypomorphs.findIndex(
          (e) => e.id === hypomorph.id
        );

        selectedGene.hypomorphs[selectedIndex] = hypomorph;

        toast.success("Gene hypomorph updated successfully");
      });
    } catch (error) {
      console.error("Error updating gene hypomorph:", error);
    } finally {
      runInAction(() => {
        this.isUpdatingHypomorph = false;
      });
    }
  };

  deleteHypomorph = async (id) => {
    this.isDeletingHypomorph = true;

    const geneId = this.rootStore.geneStore.selectedGene.id;

    // Ensure id is not null, undefined, or empty
    if (!id?.trim()) {
      throw new Error("id is required and cannot be empty.");
    }

    try {
      await GeneHypomorphAPI.delete(geneId, id);
      runInAction(() => {
        // remove hypomorph from gene hypomorph list
        const gene = this.rootStore.geneStore.geneRegistry.get(geneId);
        const indexOfEss = gene.hypomorphs.findIndex((e) => e.id === id);
        gene.hypomorphs.splice(indexOfEss, 1);

        // remove the same from selected gene
        const selectedGene = this.rootStore.geneStore.selectedGene;
        const selectedIndex = selectedGene.hypomorphs.findIndex(
          (e) => e.id === id
        );
        selectedGene.hypomorphs.splice(selectedIndex, 1);

        toast.success("Gene hypomorph deleted successfully");
      });
    } catch (error) {
      console.error("Error deleting gene hypomorph:", error);
    } finally {
      runInAction(() => {
        this.isDeletingHypomorph = false;
      });
    }
  };
}
