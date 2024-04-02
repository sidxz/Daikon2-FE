import AxiosWithAuth from "../../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const ProjectCompoundEvoAPI = {
  add: (ce) =>
    axiosWithAuth.post(`/v2/project/${ce.portfolioId}/compound-evolution`, ce),
  update: (ce) =>
    axiosWithAuth.put(
      `/v2/project/${ce.portfolioId}/compound-evolution/${ce.id}`,
      ce
    ),
  delete: (portfolioId, cEvoId) =>
    axiosWithAuth.delete(
      `/v2/project/${portfolioId}/compound-evolution/${cEvoId}`
    ),
};

export default ProjectCompoundEvoAPI;
