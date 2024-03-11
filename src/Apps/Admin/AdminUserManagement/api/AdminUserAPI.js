import AxiosWithAuth from "../../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const AdminUserAPI = {
  list: () => axiosWithAuth.get("/v2/user"),
  read: (id) => axiosWithAuth.get(`/v2/user/${id}`),
  create: (data) => axiosWithAuth.post("/v2/user", data),
  update: (id, data) => axiosWithAuth.put(`/v2/user/${id}`, data),
  delete: (id) => axiosWithAuth.delete(`/v2/user/${id}`),
};

export default AdminUserAPI;
