import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { toast } from "react-toastify";
import ProjectAPI from "../api/ProjectAPI";

export default class ProjectStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      projectList: computed,
      portfolioList: computed,
      postPortfolioList: computed,
      isFetchingProjects: observable,
      fetchProjects: action,
      projectListRegistry: observable,
      isProjectListCacheValid: observable,

      fetchProject: action,
      isFetchingProject: observable,
      projectRegistry: observable,
      isProjectRegistryCacheValid: observable,
      selectedProject: observable,

      isUpdatingProject: observable,
      updateProject: action,
      updateProjectAssociation: action,

      isAddingProject: observable,
      addProject: action,

      isDeletingProject: observable,
      deleteProject: action,

      activeH2LProjects: computed,
      activeLOProjects: computed,
      activeSPProjects: computed,
      activeINDProjects: computed,
      activeP1Projects: computed,

      readyForPortfolio: computed,

      allH2LProjects: computed,
      allLOProjects: computed,
      allSPProjects: computed,
      allINDProjects: computed,
      allP1Projects: computed,
    });
  }

  // Observables
  isFetchingProjects = false;
  isProjectListCacheValid = false;
  projectListRegistry = new Map();

  isFetchingProject = false;
  projectRegistry = new Map();
  isProjectRegistryCacheValid = false;
  selectedProject = null;

  isUpdatingProject = false;
  isAddingProject = false;
  isDeletingProject = false;

  // Actions

  fetchProjects = async (inValidateCache = false) => {
    if (inValidateCache) {
      this.isProjectListCacheValid = false;
    }
    if (this.isProjectListCacheValid) {
      return;
    }
    this.isFetchingProjects = true;
    try {
      const projects = await ProjectAPI.list();
      runInAction(() => {
        projects.forEach((project) => {
          this.projectListRegistry.set(project.id, project);
        });
        this.isProjectListCacheValid = true;
      });
    } catch (error) {
      console.error("Error fetching Projects", error);
    } finally {
      runInAction(() => {
        this.isFetchingProjects = false;
      });
    }
  };

  get projectList() {
    return Array.from(this.projectListRegistry.values());
  }

  get portfolioList() {
    return this.projectList.filter(
      (project) =>
        project.stage === "H2L" ||
        project.stage === "LO" ||
        project.stage === "SP"
    );
  }

  get postPortfolioList() {
    return this.projectList.filter(
      (project) => project.stage === "IND" || project.stage === "P1"
    );
  }

  fetchProject = async (projectId, inValidateCache = false) => {
    console.log("fetchProject -> projectId", projectId);
    if (inValidateCache) {
      this.isProjectRegistryCacheValid = false;
    }

    this.isFetchingProject = true;
    if (this.isProjectRegistryCacheValid) {
      // find project in registry and return if found
      const project = this.projectRegistry.get(projectId);
      if (project) {
        this.isFetchingProject = false;
        this.selectedProject = project;
      }
    }

    try {
      const project = await ProjectAPI.getById(projectId);
      runInAction(() => {
        this.projectRegistry.set(project.id, project);
        this.isProjectRegistryCacheValid = true;
        this.selectedProject = project;
      });
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      runInAction(() => {
        this.isFetchingProject = false;
      });
    }
  };

  addProject = async (project) => {
    project.isProjectRemoved = false;
    this.isAddingProject = true;
    try {
      var res = await ProjectAPI.create(project);
      runInAction(() => {
        // Add project to project list
        project.id = res.id;
        this.projectRegistry.set(project.id, project);
        this.projectListRegistry.set(project.id, project);
        this.selectedProject = project;

        console.log("addProject List", this.projectListRegistry);
        toast.success("Project added successfully");
      });
    } catch (error) {
      console.error("Error adding project:", error);
    } finally {
      runInAction(() => {
        this.isAddingProject = false;
      });
    }
  };

  updateProject = async (project) => {
    this.isUpdatingProject = true;

    try {
      await ProjectAPI.update(project);
      runInAction(() => {
        // update in project registry list
        this.projectRegistry.set(project.id, project);
        this.projectListRegistry.set(project.id, project);
        this.selectedProject = project;
        toast.success("Project updated successfully");
      });
    } catch (error) {
      console.error("Error updating project:", error);
    } finally {
      runInAction(() => {
        this.isUpdatingProject = false;
      });
    }
  };

  updateProjectAssociation = async (project) => {
    this.isUpdatingProject = true;

    try {
      await ProjectAPI.updateAssociation(project);
      runInAction(() => {
        // update in project registry list
        project = { ...this.selectedProject, ...project };
        this.projectRegistry.set(project.id, project);
        this.projectListRegistry.set(project.id, project);
        this.selectedProject = project;
        toast.success("Project HA association updated successfully");
      });
    } catch (error) {
      console.error("Error updating project:", error);
    } finally {
      runInAction(() => {
        this.isUpdatingProject = false;
      });
    }
  };

  deleteProject = async (projectId) => {
    this.isDeletingProject = true;

    // Ensure projectId is not null, undefined, or empty
    if (!projectId?.trim()) {
      throw new Error("projectId is required and cannot be empty.");
    }

    try {
      await ProjectAPI.delete(projectId, projectId);
      runInAction(() => {
        // remove project from project list
        this.projectRegistry.delete(projectId);
        this.projectListRegistry.delete(projectId);
        toast.success("Project deleted successfully");
      });
    } catch (error) {
      console.error("Error deleting project:", error);
    } finally {
      runInAction(() => {
        this.isDeletingProject = false;
      });
    }
  };

  /* Computed */

  get activeH2LProjects() {
    return this.projectList.filter(
      (item) => item.stage === "H2L" && item.isProjectRemoved === false
    );
  }

  get activeLOProjects() {
    return this.projectList.filter(
      (item) => item.stage === "LO" && item.isProjectRemoved === false
    );
  }

  get activeSPProjects() {
    return this.projectList.filter(
      (item) => item.stage === "SP" && item.isProjectRemoved === false
    );
  }

  get activeINDProjects() {
    return this.projectList.filter(
      (item) => item.stage === "IND" && item.isProjectRemoved === false
    );
  }

  get activeP1Projects() {
    return this.projectList.filter(
      (item) => item.stage === "P1" && item.isProjectRemoved === false
    );
  }

  get allH2LProjects() {
    return this.projectList.filter((item) => item.stage === "H2L");
  }

  get allLOProjects() {
    return this.projectList.filter((item) => item.stage === "LO");
  }

  get allSPProjects() {
    return this.projectList.filter((item) => item.stage === "SP");
  }

  get allINDProjects() {
    return this.projectList.filter((item) => item.stage === "IND");
  }

  get allP1Projects() {
    return this.projectList.filter((item) => item.stage === "P1");
  }

  get readyForPortfolio() {
    console.log(
      "this.rootStore.haStore.haPortfolioReadyList",
      this.rootStore.haStore.haPortfolioReadyList
    );
    return this.rootStore.haStore.haPortfolioReadyList.filter(
      (ha) => !this.projectList.some((project) => project.haId === ha.id)
    );
  }
}
