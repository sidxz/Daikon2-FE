import AxiosWithAuth from "../../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const AdminRolesAPI = {
  list: () => axiosWithAuth.get("/v2/roles"),
  read: (id) => axiosWithAuth.get(`/v2/roles/${id}`),
  create: (data) => axiosWithAuth.post("/v2/roles", data),
  update: (id, data) => axiosWithAuth.put(`/v2/roles/${id}`, data),
  delete: (id) => axiosWithAuth.delete(`/v2/roles/${id}`),
};

export default AdminRolesAPI;
