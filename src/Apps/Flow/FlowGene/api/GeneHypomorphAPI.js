import AxiosWithAuth from "../../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const GeneHypomorphAPI = {
  create: (data) =>
    axiosWithAuth.post(`/v2/gene/${data.geneId}/hypomorph`, data),

  update: (data) =>
    axiosWithAuth.put(`/v2/gene/${data.geneId}/hypomorph/${data.id}`, data),

  delete: (geneId, hypomorphId) =>
    axiosWithAuth.delete(`/v2/gene/${geneId}/hypomorph/${hypomorphId}`),
};

export default GeneHypomorphAPI;
