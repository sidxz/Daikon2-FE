import AxiosWithAuth from "../../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const GeneProteinProductionAPI = {
  create: (data) =>
    axiosWithAuth.post(`/v2/gene/${data.geneId}/protein-production`, data),

  update: (data) =>
    axiosWithAuth.put(
      `/v2/gene/${data.geneId}/protein-production/${data.proteinProductionId}`,
      data
    ),

  delete: (id, proteinProductionId) =>
    axiosWithAuth.delete(`/v2/gene/${id}/protein-production/${proteinProductionId}`),
};

export default GeneProteinProductionAPI;
