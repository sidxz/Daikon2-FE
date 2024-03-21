import AxiosWithAuth from "../../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const TPQAPI = {
  listUnverified: () => axiosWithAuth.get("/v2/target/tpq/unverified"),
  getById: (id) => axiosWithAuth.get(`/v2/target/tpq/${id}`),
  getByTargetId: (targetId) =>
    axiosWithAuth.get(`/v2/target/tpq/by-target-id/${targetId}`),
  submit: (QResponse) => axiosWithAuth.post("/v2/target/tpq/", QResponse),
  update: (QResponse) =>
    axiosWithAuth.put(`/v2/target/tpq/${QResponse.id}`, QResponse),
  approve: (approveDTO) =>
    axiosWithAuth.post(
      `/v2/target/tpq/${approveDTO.tPQId}/approve/`,
      approveDTO
    ),
};

export default TPQAPI;
