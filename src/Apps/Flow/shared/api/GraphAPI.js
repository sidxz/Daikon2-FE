import AxiosWithAuth from "../../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const GraphAPI = {
  findTarget: (id) => axiosWithAuth.get(`/v2/horizon/find-target/${id}`),
};

export default GraphAPI;
