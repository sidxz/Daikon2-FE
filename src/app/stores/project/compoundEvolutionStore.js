import { action, makeObservable, observable, runInAction } from "mobx";
import { toast } from "react-toastify";

import agent from "../../api/agent";

export default class CompoundEvolutionStore {
  rootStore;

  isLoadingCompoundEvolution = false;
  compoundEvolutionRegistry = new Map();
  isCompoundEvolutionRegistryCacheValid = false;
  selectedCompoundEvolution = null;
  isAddingCompoundEvolution = false;
  isEditingCompoundEvolution = false;
  isDeletingCompoundEvolution = false;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      isLoadingCompoundEvolution: observable,
      fetchCompoundEvolution: action,
      isCompoundEvolutionRegistryCacheValid: observable,
      selectedCompoundEvolution: observable,

      addCompoundEvolution: action,
      isAddingCompoundEvolution: observable,

      editCompoundEvolution: action,
      isEditingCompoundEvolution: observable,

      deleteCompoundEvolution: action,
      isDeletingCompoundEvolution: observable,
    });
  }

  fetchCompoundEvolution = async (projectId) => {
    this.isLoadingCompoundEvolution = true;

    // first check cache
    let fetchedCompoundEvolution =
      this.compoundEvolutionRegistry.get(projectId);
    if (
      this.isCompoundEvolutionRegistryCacheValid &&
      fetchedCompoundEvolution
    ) {
      this.selectedCompoundEvolution = fetchedCompoundEvolution;
      this.isLoadingCompoundEvolution = false;
    }
    // if not found fetch from api
    else {
      try {
        fetchedCompoundEvolution = await agent.Projects.getCompoundEvolution(
          projectId
        );
        runInAction(() => {
          this.selectedCompoundEvolution = fetchedCompoundEvolution;
          this.compoundEvolutionRegistry.set(
            projectId,
            fetchedCompoundEvolution
          );
        });
      } catch (error) {
        console.error(error);
      } finally {
        runInAction(() => {
          this.isLoadingCompoundEvolution = false;
        });
      }
    }
  };

  addCompoundEvolution = async (newCompoundEvolution) => {
    this.isAddingCompoundEvolution = true;
    let res = null;
    // send to server
    try {
      res = await agent.Projects.addCompoundEvolution(
        this.rootStore.projectStore.selectedProject.id,
        newCompoundEvolution
      );
      runInAction(() => {
        toast.success("Successfully added new structure");
        this.isCompoundEvolutionRegistryCacheValid = false;
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isAddingCompoundEvolution = false;
      });
    }
    return res;
  };

  editCompoundEvolution = async (editedCompoundEvolution) => {
    this.isEditingCompoundEvolution = true;
    let res = null;
    // send to server
    try {
      res = await agent.Projects.editCompoundEvolution(
        this.rootStore.projectStore.selectedProject.id,
        editedCompoundEvolution.id,
        editedCompoundEvolution
      );
      runInAction(() => {
        toast.success("Successfully edited compound evolution entry");
        this.isCompoundEvolutionRegistryCacheValid = false;
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isEditingCompoundEvolution = false;
      });
    }
    return res;
  };

  deleteCompoundEvolution = async (id) => {
    this.isDeletingCompoundEvolution = true;
    let res = null;
    // send to server
    try {
      res = await agent.Projects.deleteCompoundEvolution(
        this.rootStore.projectStore.selectedProject.id,
        id
      );
      runInAction(() => {
        toast.success("Successfully deleted compound evolution entry.");
        this.isCompoundEvolutionRegistryCacheValid = false;
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isDeletingCompoundEvolution = false;
      });
    }
    return res;
  };
}
