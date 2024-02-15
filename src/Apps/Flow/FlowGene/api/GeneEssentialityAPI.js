import AxiosWithAuth from "../../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const GeneEssentialityAPI = {
  create: (data) =>
    axiosWithAuth.post(`/v2/gene/${data.geneId}/essentiality`, data),

  update: (data) =>
    axiosWithAuth.put(
      `/v2/gene/${data.geneId}/essentiality/${data.essentialityId}`,
      data
    ),

  delete: (id, essentialityId) =>
    axiosWithAuth.delete(`/v2/gene/${id}/essentiality/${essentialityId}`),
};

export default GeneEssentialityAPI;
