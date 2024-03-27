import AxiosWithAuth from "../../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const HitAssessmentAPI = {
  list: () => axiosWithAuth.get("/v2/hit-assessment"),
  create: (ha) => axiosWithAuth.post("/v2/hit-assessment", ha),
  update: (ha) => axiosWithAuth.put(`/v2/hit-assessment/${ha.id}`, ha),
  delete: (id) => axiosWithAuth.delete(`/v2/hit-assessment/${id}`),
  getById: (id) => axiosWithAuth.get(`/v2/hit-assessment/by-id/${id}`),
};

export default HitAssessmentAPI;
