import AxiosWithAuth from "../../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const GeneUnpublishedStructuralInformationAPI = {
  create: (data) =>
    axiosWithAuth.post(`/v2/gene/${data.geneId}/unpublished-structural-information`, data),

  update: (data) =>
    axiosWithAuth.put(
      `/v2/gene/${data.geneId}/unpublished-structural-information/${data.unpublishedStructuralInformationId}`,
      data
    ),

  delete: (id, unpublishedStructuralInformationId) =>
    axiosWithAuth.delete(`/v2/gene/${id}/unpublished-structural-information/${unpublishedStructuralInformationId}`),
};

export default GeneUnpublishedStructuralInformationAPI;
