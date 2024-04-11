import AxiosWithAuth from "../../Shared/Axios/AxiosWithAuth";
const axiosWithAuth = new AxiosWithAuth();

const HorizonAPI = {
  get: (id) => axiosWithAuth.get(`/v2/horizon/${id}`),
};

export default HorizonAPI;
