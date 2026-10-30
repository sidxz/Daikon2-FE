import AxiosWithAuth from "../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const AuthApi = {
  // rejectWithError: AuthStore needs the status to tell "server down" from "not a DAIKON user"
  validate: () =>
    axiosWithAuth.get("/v2/user/header", { rejectWithError: true }),
  getAppVars: () => axiosWithAuth.get("/v2/app-settings/app-vars"),
  getGlobalValues: () => axiosWithAuth.get("/v2/app-settings/global-values"),
};

export default AuthApi;
