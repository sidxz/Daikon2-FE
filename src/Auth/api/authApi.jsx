import AxiosWithAuth from "../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const AuthApi = {
  validate: () => axiosWithAuth.get("/v2/user/header"),
  getAppVars: () => axiosWithAuth.get("/v2/app-settings/app-vars"),
  getGlobalValues: () => axiosWithAuth.get("/v2/app-settings/global-values"),
};

export default AuthApi;
