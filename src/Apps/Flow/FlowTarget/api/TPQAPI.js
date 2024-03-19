import AxiosWithAuth from "../../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const TPQAPI = {
  listUnverified: () => axiosWithAuth.get("/v2/target/tpq/unverified"),
  submit: (QResponse) => axiosWithAuth.post("/v2/target/tpq/submit", QResponse),
};

export default TPQAPI;
