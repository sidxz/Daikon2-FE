import { action, makeObservable, observable, runInAction } from "mobx";
import { toast } from "react-toastify";

export default class ProjectCompoundEvoStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      isUpdatingProjectCEvo: observable,
      updateProjectCEvo: action,

      isAddingProjectCEvo: observable,
      addProjectCEvo: action,

      isDeletingProjectCEvo: observable,
      deleteProjectCEvo: action,
    });
  }

  // Observables
  isUpdatingProjectCEvo = false;
  isAddingProjectCEvo = false;
  isDeletingProjectCEvo = false;
  isBatchInsertingHits = false;

  // Actions
  addProjectCEvo = async (cEvo, silent = false) => {
    this.isAddingProjectCEvo = true;

    // Ensure cEvo.portfolioId is set ,error out if not
    if (!cEvo.portfolioId?.trim()) {
      throw new Error("portfolioId is required and cannot be empty.");
    }

    // set stage to Project
    cEvo.stage = this.rootStore.projectStore.selectedProject.stage || "H2L";

    try {
      var res = await ProjectCompoundEvoAPI.add(cEvo);
      runInAction(() => {
        // Add cEvo to cEvo list
        cEvo.id = res.id;
        cEvo = { ...cEvo, ...res };

        const portfolio = this.rootStore.projectStore.projectRegistry.get(
          cEvo.portfolioId
        );
        console.log("Found portfolio from registry", portfolio);
        console.log("Adding cEvo to portfolio", cEvo);
        portfolio.portfolioCompoundEvolution.push(cEvo);

        // sort by evolutionDate
        portfolio.portfolioCompoundEvolution =
          portfolio.portfolioCompoundEvolution.sort(
            (a, b) => new Date(b.evolutionDate) - new Date(a.evolutionDate)
          );

        this.rootStore.projectStore.selectedProject = portfolio;

        if (!silent)
          toast.success(
            "Compound Evolution added successfully. Please Sync to fetch calculated values."
          );
      });
    } catch (error) {
      console.error("Error adding Compound Evolution:", error);
    } finally {
      runInAction(() => {
        this.isAddingProjectCEvo = false;
      });
    }
  };

  updateProjectCEvo = async (cEvo, silent = false) => {
    this.isUpdatingProjectCEvo = true;

    // Ensure cEvo.portfolioId is set, fallback to selectedProject.portfolioId if null, undefined, or empty
    cEvo.portfolioId =
      cEvo.portfolioId?.trim() ||
      this.rootStore.projectStore.selectedProject.id;

    // Ensure cEvo.hitId is not null, undefined, or empty
    if (!cEvo.id?.trim()) {
      throw new Error("hitId is required and cannot be empty.");
    }
    cEvo.hitId = cEvo.id;

    // set stage to H2L
    cEvo.stage = this.rootStore.projectStore.selectedProject.stage || "H2L";

    console.log("updateProjectCEvo", cEvo);

    try {
      await ProjectCompoundEvoAPI.update(cEvo);
      runInAction(() => {
        // update in portfolio registry list
        const portfolio = this.rootStore.projectStore.projectRegistry.get(
          cEvo.portfolioId
        );

        const indexOfEss = portfolio.portfolioCompoundEvolution.findIndex(
          (e) => e.id === cEvo.id
        );
        portfolio.portfolioCompoundEvolution[indexOfEss] = cEvo;

        // sort by evolutionDate
        portfolio.portfolioCompoundEvolution =
          portfolio.portfolioCompoundEvolution.sort(
            (a, b) => new Date(b.evolutionDate) - new Date(a.evolutionDate)
          );

        this.rootStore.projectStore.selectedProject = portfolio;

        if (!silent) toast.success("Compound Evolution updated successfully");
      });
    } catch (error) {
      console.error("Error updating portfolio cEvo:", error);
    } finally {
      runInAction(() => {
        this.isUpdatingProjectCEvo = false;
      });
    }
  };

  deleteProjectCEvo = async (projectId, cEvoId) => {
    this.isDeletingProjectCEvo = true;

    const portfolioId =
      projectId?.trim() || this.rootStore.projectStore.selectedProject.id;

    // Ensure hitId is not null, undefined, or empty
    if (!portfolioId?.trim()) {
      throw new Error("hitId is required and cannot be empty.");
    }

    if (!cEvoId) {
      throw new Error("Compound Evolution Id is required and cannot be empty.");
    }

    try {
      await ProjectCompoundEvoAPI.delete(portfolioId, cEvoId);
      runInAction(() => {
        // remove cEvo from portfolio cEvo list
        const portfolio =
          this.rootStore.projectStore.projectRegistry.get(portfolioId);
        const indexOfEss = portfolio.portfolioCompoundEvolution.findIndex(
          (e) => e.id === cEvoId
        );
        portfolio.portfolioCompoundEvolution.splice(indexOfEss, 1);
        this.rootStore.projectStore.selectedProject = portfolio;

        toast.success("Compound Evolution deleted successfully");
      });
    } catch (error) {
      console.error("Error deleting portfolio cEvo:", error);
    } finally {
      runInAction(() => {
        this.isDeletingProjectCEvo = false;
      });
    }
  };
}
