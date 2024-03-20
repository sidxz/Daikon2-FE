import AxiosWithAuth from "../../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const TPQAPI = {
  listUnverified: () => axiosWithAuth.get("/v2/target/tpq/unverified"),
  getById: (id) => axiosWithAuth.get(`/v2/target/tpq/${id}`),
  submit: (QResponse) => axiosWithAuth.post("/v2/target/tpq/", QResponse),
  update: (QResponse) =>
    axiosWithAuth.put(`/v2/target/tpq/${QResponse.id}`, QResponse),
};

export default TPQAPI;
