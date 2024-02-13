import AxiosWithAuth from "../../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const GeneAPI = {
  list: () => axiosWithAuth.get("/v2/gene"),
};

export default GeneAPI;
