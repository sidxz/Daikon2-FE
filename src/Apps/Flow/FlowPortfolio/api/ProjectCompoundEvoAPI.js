import AxiosWithAuth from "../../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const ProjectCompoundEvoAPI = {
  add: (ce) =>
    axiosWithAuth.post(`/v2/project/${ce.projectId}/compound-evolution`, ce),
  update: (ce) =>
    axiosWithAuth.put(
      `/v2/project/${ce.projectId}/compound-evolution/${ce.id}`,
      ce
    ),
  delete: (projectId, cEvoId) =>
    axiosWithAuth.delete(
      `/v2/project/${projectId}/compound-evolution/${cEvoId}`
    ),
};

export default ProjectCompoundEvoAPI;
