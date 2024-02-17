import AxiosWithAuth from "../../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const GeneHypomorphAPI = {
  create: (data) =>
    axiosWithAuth.post(`/v2/gene/${data.geneId}/hypomorph`, data),

  update: (data) =>
    axiosWithAuth.put(
      `/v2/gene/${data.geneId}/hypomorph/${data.hypomorphId}`,
      data
    ),

  delete: (id, hypomorphId) =>
    axiosWithAuth.delete(`/v2/gene/${id}/hypomorph/${hypomorphId}`),
};

export default GeneHypomorphAPI;
