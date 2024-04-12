import AxiosWithAuth from "../../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const GeneProteinProductionAPI = {
  create: (data) =>
    axiosWithAuth.post(`/v2/gene/${data.geneId}/protein-production`, data),

  update: (data) =>
    axiosWithAuth.put(
      `/v2/gene/${data.geneId}/protein-production/${data.id}`,
      data
    ),

  delete: (geneId, proteinProductionId) =>
    axiosWithAuth.delete(
      `/v2/gene/${geneId}/protein-production/${proteinProductionId}`
    ),
};

export default GeneProteinProductionAPI;
