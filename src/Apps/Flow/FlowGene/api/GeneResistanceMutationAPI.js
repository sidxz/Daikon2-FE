import AxiosWithAuth from "../../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const GeneResistanceMutationAPI = {
  create: (data) =>
    axiosWithAuth.post(`/v2/gene/${data.geneId}/resistance-mutation`, data),

  update: (data) =>
    axiosWithAuth.put(
      `/v2/gene/${data.geneId}/resistance-mutation/${data.id}`,
      data
    ),

  delete: (geneId, resistanceMutationId) =>
    axiosWithAuth.delete(
      `/v2/gene/${geneId}/resistance-mutation/${resistanceMutationId}`
    ),
};

export default GeneResistanceMutationAPI;
