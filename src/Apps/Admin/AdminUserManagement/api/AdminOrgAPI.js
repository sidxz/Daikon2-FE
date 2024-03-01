import AxiosWithAuth from "../../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const AdminOrgAPI = {
  list: () => axiosWithAuth.get("/v2/org"),
  read: (id) => axiosWithAuth.get(`/v2/org/${id}`),
  create: (data) => axiosWithAuth.post("/v2/org", data),
  update: (id, data) => axiosWithAuth.put(`/v2/org/${id}`, data),
  delete: (id) => axiosWithAuth.delete(`/v2/org/${id}`),
};

export default AdminOrgAPI;
