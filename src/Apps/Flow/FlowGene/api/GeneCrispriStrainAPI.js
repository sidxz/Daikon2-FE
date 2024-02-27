import AxiosWithAuth from "../../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const GeneCrispriStrainAPI = {
  create: (data) =>
    axiosWithAuth.post(`/v2/gene/${data.geneId}/crispri-strain`, data),

  update: (data) =>
    axiosWithAuth.put(
      `/v2/gene/${data.geneId}/crispri-strain/${data.crispriStrainId}`,
      data
    ),

  delete: (id, crispriStrainId) =>
    axiosWithAuth.delete(`/v2/gene/${id}/crispri-strain/${crispriStrainId}`),
};

export default GeneCrispriStrainAPI;
