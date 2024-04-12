import AxiosWithAuth from "../../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const GeneUnpublishedStructuralInformationAPI = {
  create: (data) =>
    axiosWithAuth.post(
      `/v2/gene/${data.geneId}/unpublished-structural-information`,
      data
    ),

  update: (data) =>
    axiosWithAuth.put(
      `/v2/gene/${data.geneId}/unpublished-structural-information/${data.id}`,
      data
    ),

  delete: (geneId, unpublishedStructuralInformationId) =>
    axiosWithAuth.delete(
      `/v2/gene/${geneId}/unpublished-structural-information/${unpublishedStructuralInformationId}`
    ),
};

export default GeneUnpublishedStructuralInformationAPI;
