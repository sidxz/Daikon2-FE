import AxiosWithAuth from "../../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const AdminHealthServicesAPI = {
  list: () => axiosWithAuth.get("/health/services"),
};

export default AdminHealthServicesAPI;
