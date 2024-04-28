import AxiosWithAuth from "../../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const GeneCrispriStrainAPI = {
  create: (data) =>
    axiosWithAuth.post(`/v2/gene/${data.geneId}/crispri-strain`, data),

  update: (data) =>
    axiosWithAuth.put(
      `/v2/gene/${data.geneId}/crispri-strain/${data.id}`,
      data
    ),

  delete: (geneId, crispriStrainId) =>
    axiosWithAuth.delete(
      `/v2/gene/${geneId}/crispri-strain/${crispriStrainId}`
    ),
};

export default GeneCrispriStrainAPI;
