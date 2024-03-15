import AxiosWithAuth from "../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const QnaireAPI = {
  list: () => axiosWithAuth.get("/v2/questionnaire"),
  read: (id) => axiosWithAuth.get(`/v2/questionnaire/by-id/${id}`),
  readByName: (name) => axiosWithAuth.get(`/v2/questionnaire/by-name/${name}`),
  create: (data) => axiosWithAuth.post("/v2/questionnaire", data),
  update: (data) => axiosWithAuth.put(`/v2/questionnaire`, data),
  delete: (id) => axiosWithAuth.delete(`/v2/questionnaire/${id}`),
};

export default QnaireAPI;
