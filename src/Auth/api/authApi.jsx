import AxiosWithAuth from "../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const AuthApi = {
  validate: () => axiosWithAuth.get("/v2/user/header"),
};

export default AuthApi;
