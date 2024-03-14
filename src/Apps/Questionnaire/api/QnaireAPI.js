import AxiosWithAuth from "../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const QnaireAPI = {
  list: () => axiosWithAuth.get("/v2/questionnaire"),
  read: (id) => axiosWithAuth.get(`/v2/questionnaire/${id}`),
  create: (data) => axiosWithAuth.post("/v2/questionnaire", data),
  update: (id, data) => axiosWithAuth.put(`/v2/questionnaire${id}`, data),
  delete: (id) => axiosWithAuth.delete(`/v2/questionnaire${id}`),
};

export default QnaireAPI;
