import axios from "axios";
import { toast } from "react-toastify";
import AppUserManager from "../../Auth/components/AppUserManager";
import { AxiosConfig } from "../../config/axiosConfig";

class AxiosWithAuth {
  constructor() {
    this.init();
  }

  async init() {
    const ssoUser = await AppUserManager.getUser();
    this.accessToken = ssoUser ? ssoUser.access_token : null;
    this.axiosWithAuth = axios.create({
      ...AxiosConfig,
    });

    // let shd = await this.shouldRefreshToken();
    // console.log("AxiosWithAuth -> init -> shd", shd);
    // if (shd) {
    //   console.log("AxiosWithAuth -> init -> Refreshing Token");
    //   await AppUserManager.refreshToken();
    //   this.accessToken = await AppUserManager.getAccessToken();
    // }

    this.setInterceptors();
  }

  async shouldRefreshToken() {
    // Check if the access token is expired or about to expire
    const tokenExpiryThreshold = 60 * 1000; // 1 minute
    const tokenExpirySeconds = await AppUserManager.getTokenExpiry();
    const tokenExpiryMilliseconds = tokenExpirySeconds * 1000;

    const currentTimeMilliseconds = Date.now();
    // console.log(
    //   "AxiosWithAuth -> Token will expire in Minutes : ",
    //   (tokenExpiryMilliseconds - currentTimeMilliseconds) / (1000 * 60)
    // );
    return (
      tokenExpirySeconds &&
      tokenExpiryMilliseconds - currentTimeMilliseconds < tokenExpiryThreshold
    );
  }

  setInterceptors() {
    this.axiosWithAuth.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          // console.log(
          //   "AxiosWithAuth -> setInterceptors -> this.accessToken",
          //   this.accessToken
          // );
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosWithAuth.interceptors.response.use(
      (response) => response,
      (error) => this.handleError(error)
    );
  }

  handleError(error) {
    let errorMessage = "An unexpected error occurred";
    if (error.response) {
      console.error("Data:", error.response.data);
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);

      const status = error.response.status;
      switch (status) {
        case 400:
          errorMessage = "Bad Request";
          toast.error(errorMessage + " " + error?.response?.data?.message);
          break;
        case 401:
          errorMessage = "Unauthorized. Please login again.";
          // do sso login
          // TEST: under observation of behavior
          AppUserManager.signinSilent();
          toast.error(errorMessage);
          break;
        case 403:
          errorMessage =
            "Forbidden. You do not have permission to perform this action.";
          toast.error(errorMessage);
          break;
        case 404:
          errorMessage = "The requested resource was not found";
          toast.error(errorMessage);
          break;
        case 409:
          errorMessage =
            "A conflict occurred, suggesting that there may be a request for a resource that already exists. Please ensure that the resource you are attempting to create or modify is not already present.";
          toast.error(errorMessage);
          break;
        case 500:
          errorMessage = "Internal Server Error";
          toast.error(errorMessage);
          break;
        case 503:
          errorMessage = "Service Unavailable";
          toast.error(errorMessage);
          break;
        default:
          errorMessage = `An error occurred with your request. Status code: ${status}`;
          toast.error(errorMessage);
      }
    } else if (error.request) {
      console.log("Error Request:", error.message);
      if (error?.message?.includes("Network Error")) {
        console.error(
          "********* Server connection Error: Unable to connect to the server *********"
        );
      }
      console.error("No response received:", error.request);
      errorMessage =
        "The request was made but no response was received. Please check your network connection.";
      toast.error(errorMessage);
    } else {
      console.error("Error:", error.message);
      errorMessage =
        error.message || "An error occurred while setting up the request.";
      toast.error(errorMessage);
    }

    console.error("Error Config:", error.config);
    return Promise.reject(errorMessage);
  }

  formatResponse = (response) => {
    return response.data;
  };

  get = async (url, config = {}) => {
    await this.init();
    // const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    // await delay(3000);
    return this.axiosWithAuth.get(url, config).then(this.formatResponse);
  };

  post = async (url, data, config = {}) => {
    data.strainId = "3175ab48-dfbb-4f31-9f80-6d61190b955c";
    await this.init();
    return this.axiosWithAuth.post(url, data, config).then(this.formatResponse);
  };

  put = async (url, data, config = {}) => {
    data.strainId = "3175ab48-dfbb-4f31-9f80-6d61190b955c";
    await this.init();
    return this.axiosWithAuth.put(url, data, config).then(this.formatResponse);
  };

  delete = async (url, config = {}) => {
    await this.init();
    return this.axiosWithAuth.delete(url, config).then(this.formatResponse);
  };
}

export default AxiosWithAuth;
