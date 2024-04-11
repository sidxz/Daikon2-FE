import { action, makeObservable, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import ProjectCompoundEvoAPI from "../api/ProjectCompoundEvoAPI";

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

  // Actions
  addProjectCEvo = async (cEvo, silent = false) => {
    this.isAddingProjectCEvo = true;

    // Ensure cEvo.projectId is set ,error out if not
    if (!cEvo.projectId?.trim()) {
      throw new Error("projectId is required and cannot be empty.");
    }

    // set stage to Project
    cEvo.stage = this.rootStore.projectStore.selectedProject.stage || "H2L";

    try {
      var res = await ProjectCompoundEvoAPI.add(cEvo);
      runInAction(() => {
        // Add cEvo to cEvo list
        cEvo.id = res.id;
        cEvo = { ...cEvo, ...res };

        const project = this.rootStore.projectStore.projectRegistry.get(
          cEvo.projectId
        );
        console.log("Found project from registry", project);
        console.log("Adding cEvo to project", cEvo);
        project.compoundEvolution.push(cEvo);

        // sort by evolutionDate
        project.compoundEvolution = project.compoundEvolution.sort(
          (a, b) => new Date(b.evolutionDate) - new Date(a.evolutionDate)
        );

        this.rootStore.projectStore.selectedProject = project;

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

    // Ensure cEvo.projectId is set, fallback to selectedProject.projectId if null, undefined, or empty
    cEvo.projectId =
      cEvo.projectId?.trim() || this.rootStore.projectStore.selectedProject.id;

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
        // update in project registry list
        const project = this.rootStore.projectStore.projectRegistry.get(
          cEvo.projectId
        );

        const indexOfEss = project.compoundEvolution.findIndex(
          (e) => e.id === cEvo.id
        );
        project.compoundEvolution[indexOfEss] = cEvo;

        // sort by evolutionDate
        project.compoundEvolution = project.compoundEvolution.sort(
          (a, b) => new Date(b.evolutionDate) - new Date(a.evolutionDate)
        );

        this.rootStore.projectStore.selectedProject = project;

        if (!silent) toast.success("Compound Evolution updated successfully");
      });
    } catch (error) {
      console.error("Error updating project cEvo:", error);
    } finally {
      runInAction(() => {
        this.isUpdatingProjectCEvo = false;
      });
    }
  };

  deleteProjectCEvo = async (portfolioId, cEvoId) => {
    this.isDeletingProjectCEvo = true;

    const projectId =
      portfolioId?.trim() || this.rootStore.projectStore.selectedProject.id;

    // Ensure hitId is not null, undefined, or empty
    if (!projectId?.trim()) {
      throw new Error("hitId is required and cannot be empty.");
    }

    if (!cEvoId) {
      throw new Error("Compound Evolution Id is required and cannot be empty.");
    }

    try {
      await ProjectCompoundEvoAPI.delete(projectId, cEvoId);
      runInAction(() => {
        // remove cEvo from project cEvo list
        const project =
          this.rootStore.projectStore.projectRegistry.get(projectId);
        const indexOfEss = project.compoundEvolution.findIndex(
          (e) => e.id === cEvoId
        );
        project.compoundEvolution.splice(indexOfEss, 1);
        this.rootStore.projectStore.selectedProject = project;

        toast.success("Compound Evolution deleted successfully");
      });
    } catch (error) {
      console.error("Error deleting project cEvo:", error);
    } finally {
      runInAction(() => {
        this.isDeletingProjectCEvo = false;
      });
    }
  };
}
