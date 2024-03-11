import AxiosWithAuth from "../../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const APIResourcesAPI = {
  list: () => axiosWithAuth.get("/v2/api-resources"),
  create: (data) => axiosWithAuth.post("/v2/api-resources", data),
  update: (id, data) => axiosWithAuth.put(`/v2/api-resources/${id}`, data),
  delete: (id) => axiosWithAuth.delete(`/v2/api-resources/${id}`),
};

export default APIResourcesAPI;
