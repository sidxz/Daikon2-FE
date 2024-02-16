import AxiosWithAuth from "../../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const GeneResistanceMutationAPI = {
  create: (data) =>
    axiosWithAuth.post(`/v2/gene/${data.geneId}/resistance-mutation`, data),

  update: (data) =>
    axiosWithAuth.put(
      `/v2/gene/${data.geneId}/resistance-mutation/${data.resistanceMutationId}`,
      data
    ),

  delete: (id, resistanceMutationId) =>
    axiosWithAuth.delete(`/v2/gene/${id}/resistance-mutation/${resistanceMutationId}`),
};

export default GeneResistanceMutationAPI;
