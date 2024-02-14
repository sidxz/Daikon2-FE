import axios from "axios";

class AxiosGeneric {
  constructor(accessToken = null, baseURL = null, responseFormatter = null) {
    this.init(accessToken);
    this.baseURL = baseURL;
    this.responseFormatter = responseFormatter;
  }

  async init(accessToken = null) {
    this.accessToken = accessToken ? accessToken : null;

    this.axiosGeneric = axios.create({
      baseURL: this.baseURL,
    });

    this.setInterceptors();
  }

  setInterceptors() {
    this.axiosGeneric.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosGeneric.interceptors.response.use(
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
          break;
        case 401:
          errorMessage = "Unauthorized. Please login again.";
          break;
        case 403:
          errorMessage =
            "Forbidden. You do not have permission to perform this action.";
          break;
        case 404:
          errorMessage = "The requested resource was not found";
          break;
        case 500:
          errorMessage = "Internal Server Error";
          break;
        case 503:
          errorMessage = "Service Unavailable";
          break;
        default:
          errorMessage = `An error occurred with your request. Status code: ${status}`;
      }
    } else if (error.request) {
      console.error("No response received:", error.request);
      errorMessage =
        "The request was made but no response was received. Please check your network connection.";
    } else {
      console.error("Error:", error.message);
      errorMessage =
        error.message || "An error occurred while setting up the request.";
    }

    console.error("Error Config:", error.config);
    return Promise.reject(errorMessage);
  }

  formatResponse = (response) => {
    if (this.responseFormatter) {
      return this.responseFormatter(response);
    }

    return response.data;
  };

  get = async (url, config = {}) => {
    await this.init();
    return this.axiosGeneric.get(url, config).then(this.formatResponse);
  };

  post = async (url, data, config = {}) => {
    await this.init();
    return this.axiosGeneric.post(url, data, config).then(this.formatResponse);
  };

  put = async (url, data, config = {}) => {
    await this.init();
    return this.axiosGeneric.put(url, data, config).then(this.formatResponse);
  };

  delete = async (url, config = {}) => {
    await this.init();
    return this.axiosGeneric.delete(url, config).then(this.formatResponse);
  };
}

export default AxiosGeneric;
