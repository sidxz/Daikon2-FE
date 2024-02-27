import AxiosWithAuth from "../../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const GeneProteinActivityAssayAPI = {
  create: (data) =>
    axiosWithAuth.post(`/v2/gene/${data.geneId}/protein-activity-assay`, data),

  update: (data) =>
    axiosWithAuth.put(
      `/v2/gene/${data.geneId}/protein-activity-assay/${data.proteinActivityAssayId}`,
      data
    ),

  delete: (id, proteinActivityAssayId) =>
    axiosWithAuth.delete(`/v2/gene/${id}/protein-activity-assay/${proteinActivityAssayId}`),
};

export default GeneProteinActivityAssayAPI;
