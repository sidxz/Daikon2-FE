import AxiosWithAuth from "../../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const ScreenAPI = {
  list: () => axiosWithAuth.get("/v2/screen"),
  getById: (id) => axiosWithAuth.get(`/v2/screen/by-id/${id}`),
  getByName: (name) => axiosWithAuth.get(`/v2/gene/by-name/${name}`),
  create: (screen) => axiosWithAuth.post("/v2/screen", screen),
  update: (screen) => axiosWithAuth.put("/v2/screen", screen),
  delete: (id) => axiosWithAuth.delete(`/v2/screen/${id}`),
};

export default ScreenAPI;
