import { action, makeObservable, observable, runInAction } from "mobx";
import { toast } from "react-toastify";

import agent from "../../api/agent";

export default class ProjectStore {
  rootStore;

  loadingProjects = false;
  loadingProject = false;
  editingProject = false;
  isTerminatingProject = false;
  creatingUnlinkedProject = false;
  projectRegistry = new Map();
  projectRegistryExpanded = new Map();
  projectRegistryCacheValid = false;
  selectedProject = null;

  loadingCompoundEvolution = false;
  compoundEvolutionRegistry = new Map();
  compoundEvolutionRegistryCacheValid = false;
  selectedCompoundEvolution = null;
  addingCompoundEvolution = false;

  editingCompoundEvolution = false;

  settingPriorityProbability = false;

  overridingStage = false;

  editingSupportingOrgs = false;

  editingPredictedDates = false;

  isUpdatingSubState = false;

  isRenamingProjectName = false;

  isRestoringProject = false;

  isDeletingProject = false;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      loadingProjects: observable,
      loadingProject: observable,
      fetchProjects: action,
      fetchProject: action,
      editingProject: observable,
      isTerminatingProject: observable,
      projectRegistry: observable,
      projectRegistryExpanded: observable,
      projectRegistryCacheValid: observable,
      selectedProject: observable,
      projects: action,

      loadingCompoundEvolution: observable,
      fetchCompoundEvolution: action,
      compoundEvolutionRegistryCacheValid: observable,
      selectedCompoundEvolution: observable,

      addCompoundEvolution: action,
      addingCompoundEvolution: observable,

      editCompoundEvolution: action,
      editingCompoundEvolution: observable,

      settingPriorityProbability: observable,
      setPriorityProbability: action,

      editProject: action,
      terminateProject: action,

      creatingUnlinkedProject: observable,
      createUnlinkedProject: action,

      overrideStage: action,
      overridingStage: observable,

      editSupportingOrgs: action,
      editingSupportingOrgs: observable,

      editPredictedDates: action,
      editingPredictedDates: observable,

      updateSubState: action,
      isUpdatingSubState: observable,

      renameProject: action,
      isRenamingProjectName: observable,

      isRestoringProject: observable,
      restoreProject: action,

      isDeletingProject: observable,
      markDeleteProject: action,
    });
  }

  fetchProjects = async () => {
    this.loadingProjects = true;
    if (this.projectRegistryCacheValid && this.projectRegistry.size !== 0) {
      this.loadingProjects = false;
      return;
    }
    try {
      var resp = await agent.Projects.list();
      runInAction(() => {
        resp.forEach((project) => {
          this.projectRegistry.set(project.id, project);
        });
        this.projectRegistryCacheValid = true;
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.loadingProjects = false;
      });
    }
  };

  fetchProject = async (id) => {
    this.loadingProject = true;

    // first check cache
    let fetchedProject = null;
    if (
      this.projectRegistryCacheValid &&
      this.projectRegistryExpanded.size !== 0
    ) {
      fetchedProject = this.projectRegistryExpanded.get(id);
    }
    if (fetchedProject) {
      this.selectedProject = fetchedProject;
      this.loadingProject = false;
    }
    // if not found fetch from api
    else {
      try {
        fetchedProject = await agent.Projects.details(id);
        runInAction(() => {
          this.selectedProject = fetchedProject;
          this.projectRegistryExpanded.set(id, fetchedProject);
        });
      } catch (error) {
        console.error(error);
      } finally {
        runInAction(() => {
          this.loadingProject = false;
        });
      }
    }
  };

  projects = () => {
    return Array.from(this.rootStore.projectStore.projectRegistry.values());
  };

  fetchCompoundEvolution = async (projectId) => {
    this.loadingCompoundEvolution = true;

    // first check cache
    let fetchedCompoundEvolution =
      this.compoundEvolutionRegistry.get(projectId);
    if (this.compoundEvolutionRegistryCacheValid && fetchedCompoundEvolution) {
      this.selectedCompoundEvolution = fetchedCompoundEvolution;
      this.loadingCompoundEvolution = false;
    }
    // if not found fetch from api
    else {
      try {
        fetchedCompoundEvolution = await agent.Projects.getcompoundevolution(
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
          this.loadingCompoundEvolution = false;
        });
      }
    }
  };

  addCompoundEvolution = async (newCompoundEvolution) => {
    this.addingCompoundEvolution = true;
    let res = null;
    // send to server
    try {
      res = await agent.Projects.addcompoundevolution(
        this.selectedProject.id,
        newCompoundEvolution
      );
      runInAction(() => {
        toast.success("Successfully added new structure");
        this.compoundEvolutionRegistryCacheValid = false;
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.addingCompoundEvolution = false;
      });
    }
    return res;
  };

  editCompoundEvolution = async (editedCompoundEvolution) => {
    this.editingCompoundEvolution = true;
    let res = null;
    // send to server
    try {
      res = await agent.Projects.editCompoundevolution(
        this.selectedProject.id,
        editedCompoundEvolution.id,
        editedCompoundEvolution
      );
      runInAction(() => {
        toast.success("Successfully edited compound evolution entry");
        this.compoundEvolutionRegistryCacheValid = false;
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.editingCompoundEvolution = false;
      });
    }
    return res;
  };

  setPriorityProbability = async (ppDTO) => {
    this.settingPriorityProbability = true;
    let res = null;
    // send to server
    try {
      res = await agent.Projects.setPriorityProbability(
        this.selectedProject.id,
        ppDTO
      );
      runInAction(() => {
        toast.success("Project successfully modified");
        this.projectRegistryCacheValid = false;
        this.fetchProject(this.selectedProject.id);
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.settingPriorityProbability = false;
      });
    }
    return res;
  };

  editProject = async (project) => {
    this.editingProject = true;
    let res = null;
    // send to server
    try {
      res = await agent.Projects.edit(this.selectedProject.id, project);
      runInAction(() => {
        toast.success("Project successfully modified");
        this.projectRegistryCacheValid = false;
        this.fetchProject(this.selectedProject.id);
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.editingProject = false;
      });
    }
    return res;
  };

  terminateProject = async (project) => {
    this.isTerminatingProject = true;
    let res = null;
    // send to server
    try {
      res = await agent.Projects.terminate(this.selectedProject.id, project);
      runInAction(() => {
        toast.success("Project successfully Terminated");
        this.projectRegistryCacheValid = false;
        this.fetchProject(this.selectedProject.id);
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isTerminatingProject = false;
      });
    }
    return res;
  };

  createUnlinkedProject = async (newProject) => {
    this.creatingUnlinkedProject = true;
    let res = null;
    // send to server
    try {
      res = await agent.Projects.createUnlinked(newProject);
      runInAction(() => {
        toast.success("Successfully created new Project");
        this.rootStore.projectStore.projectRegistryCacheValid = false;
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.creatingUnlinkedProject = false;
      });
    }
    return res;
  };

  overrideStage = async (overrideDTO) => {
    this.overridingStage = true;
    let res = null;
    // send to server
    try {
      res = await agent.Projects.stageOverride(
        this.selectedProject.id,
        overrideDTO
      );
      runInAction(() => {
        toast.success("Project stage successfully overridden.");
        this.projectRegistryCacheValid = false;
        this.fetchProject(this.selectedProject.id);
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.overridingStage = false;
      });
    }
    return res;
  };

  editSupportingOrgs = async (editSupportingOrgsDTO) => {
    this.editingSupportingOrgs = true;
    let res = null;
    // send to server
    try {
      res = await agent.Projects.editSupportingOrg(
        this.selectedProject.id,
        editSupportingOrgsDTO
      );
      runInAction(() => {
        toast.success("Saved project supporting organizations.");
        this.projectRegistryCacheValid = false;
        this.fetchProject(this.selectedProject.id);
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.editingSupportingOrgs = false;
      });
    }
    return res;
  };

  editPredictedDates = async (projectDTO) => {
    this.editingPredictedDates = true;
    let res = null;
    // send to server
    try {
      res = await agent.Projects.editPredictedDated(
        this.selectedProject.id,
        projectDTO
      );
      runInAction(() => {
        toast.success("Saved predicted date.");
        this.projectRegistryCacheValid = false;
        this.fetchProject(this.selectedProject.id);
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.editingPredictedDates = false;
      });
    }
    return res;
  };

  updateSubState = async (subStateDto) => {
    console.log("updateSubState: ", subStateDto);
    this.isUpdatingSubState = true;
    let res = null;
    // send to server
    try {
      res = await agent.Projects.updateSubState(
        this.selectedProject.id,
        subStateDto
      );
      runInAction(() => {
        toast.success("Saved.");
        this.projectRegistryCacheValid = false;
        this.fetchProject(this.selectedProject.id);
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isUpdatingSubState = false;
      });
    }
    return res;
  };

  renameProject = async (updatedProjectName) => {
    this.isRenamingProjectName = true;
    let res = null;
    // send to server
    try {
      res = await agent.Projects.rename(this.selectedProject.id, {
        id: this.selectedProject.id,
        updatedName: updatedProjectName,
      });
      runInAction(() => {
        toast.success("Project renamed successfully!");
        this.projectRegistryCacheValid = false;
        this.fetchProject(this.selectedProject.id);
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isRenamingProjectName = false;
      });
    }
    return res;
  };

  restoreProject = async (project) => {
    this.isRestoringProject = true;
    let res = null;
    // send to server
    try {
      res = await agent.Projects.restore(this.selectedProject.id, project);
      runInAction(() => {
        toast.success("Project restored successfully!");
        this.projectRegistryCacheValid = false;
        this.fetchProject(this.selectedProject.id);
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isRestoringProject = false;
      });
    }
    return res;
  };

  markDeleteProject = async (project) => {
    this.isDeletingProject = true;
    let res = null;
    // send to server
    try {
      res = await agent.Projects.markDelete(this.selectedProject.id, project);
      runInAction(() => {
        toast.success("Project marked as deleted successfully!");
        this.projectRegistryCacheValid = false;
        this.fetchProject(this.selectedProject.id);
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isDeletingProject = false;
      });
    }
    return res;
  };
}
