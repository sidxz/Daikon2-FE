import axios from "axios";
import { toast } from "react-toastify";
import AppUserManager from "../../Auth/components/AppUserManager";
import { AxiosConfig } from "../../config/axiosConfig";

/** ------------------------------------------------------------------
 * Toast control: deduplicate by message + throttle (2 seconds)
 * ------------------------------------------------------------------ */
const activeToasts = new Set(); // track messages currently displayed
const lastToastTimeByMessage = new Map(); // track last shown time per message
const TOAST_INTERVAL_MS = 2000; // 2 seconds

function showThrottledUniqueErrorToast(message) {
  const now = Date.now();
  const last = lastToastTimeByMessage.get(message) || 0;

  if (activeToasts.has(message)) return; // Already on screen
  if (now - last < TOAST_INTERVAL_MS) return; // Too soon since last

  toast.error(message, {
    onClose: () => {
      activeToasts.delete(message);
    },
  });

  activeToasts.add(message);
  lastToastTimeByMessage.set(message, now);
}

/** ------------------------------------------------------------------
 * GET request throttling (same request >2 times in 2s → block)
 * ------------------------------------------------------------------ */
const GET_DUP_WINDOW_MS = 2000;
const GET_DUP_MAX_REQUESTS = 2;
const getRequestTimestamps = new Map();

function stableStringify(obj) {
  if (!obj || typeof obj !== "object") return JSON.stringify(obj);
  const allKeys = [];
  JSON.stringify(obj, (key, value) => (allKeys.push(key), value));
  allKeys.sort();
  return JSON.stringify(obj, allKeys);
}

function buildGetKey(config) {
  const base = config.baseURL || "";
  const url = config.url || "";
  const paramsStr = stableStringify(config.params || {});
  return `${base}|${url}|${paramsStr}`;
}

class AxiosWithAuth {
  constructor() {
    this.enableGetThrottle = true; // <--- NEW FLAG (set false to disable GET throttling)
    this.init();
  }

  async init() {
    const ssoUser = await AppUserManager.getUser();
    this.accessToken = ssoUser ? ssoUser.access_token : null;
    this.axiosWithAuth = axios.create({
      ...AxiosConfig,
    });
    this.setInterceptors();
  }

  async shouldRefreshToken() {
    const tokenExpiryThreshold = 60 * 1000;
    const tokenExpirySeconds = await AppUserManager.getTokenExpiry();
    const tokenExpiryMilliseconds = tokenExpirySeconds * 1000;
    const currentTimeMilliseconds = Date.now();
    return (
      tokenExpirySeconds &&
      tokenExpiryMilliseconds - currentTimeMilliseconds < tokenExpiryThreshold
    );
  }

  setInterceptors() {
    this.axiosWithAuth.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }

        // Throttle identical GET requests (if enabled)
        if (
          this.enableGetThrottle &&
          (config.method || "get").toLowerCase() === "get"
        ) {
          const key = buildGetKey(config);
          const now = Date.now();
          const arr = getRequestTimestamps.get(key) || [];
          const recent = arr.filter((t) => now - t <= GET_DUP_WINDOW_MS);

          if (recent.length >= GET_DUP_MAX_REQUESTS) {
            const msg = `Blocked duplicate GET within ${GET_DUP_WINDOW_MS}ms: ${key}`;
            const err = new axios.Cancel(msg);
            err.__blockedDuplicate = true;
            console.error(msg);
            return Promise.reject(err);
          }

          recent.push(now);
          getRequestTimestamps.set(key, recent);
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
    if (axios.isCancel(error) || error?.__blockedDuplicate) {
      return Promise.reject(error);
    }

    let errorMessage = "An unexpected error occurred";
    if (error.response) {
      console.error("Data:", error.response.data);
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);

      const status = error.response.status;
      switch (status) {
        case 400: {
          errorMessage = "Bad Request";
          const composed =
            errorMessage + " " + (error?.response?.data?.message || "");
          showThrottledUniqueErrorToast(composed.trim());
          break;
        }
        case 401:
          errorMessage = "Unauthorized. Please login again.";
          AppUserManager.signinSilent();
          showThrottledUniqueErrorToast(errorMessage);
          break;
        case 403:
          errorMessage =
            "Forbidden. You do not have permission to perform this action.";
          showThrottledUniqueErrorToast(errorMessage);
          break;
        case 404:
          errorMessage = "The requested resource was not found";
          showThrottledUniqueErrorToast(errorMessage);
          break;
        case 409:
          errorMessage =
            "A conflict occurred, suggesting that there may be a request for a resource that already exists. Please ensure that the resource you are attempting to create or modify is not already present.";
          showThrottledUniqueErrorToast(errorMessage);
          break;
        case 500:
          errorMessage = "Internal Server Error";
          showThrottledUniqueErrorToast(errorMessage);
          break;
        case 503:
          errorMessage = "Service Unavailable";
          showThrottledUniqueErrorToast(errorMessage);
          break;
        default:
          errorMessage = `An error occurred with your request. Status code: ${status}`;
          showThrottledUniqueErrorToast(errorMessage);
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
      showThrottledUniqueErrorToast(errorMessage);
    } else {
      console.error("Error:", error.message);
      errorMessage =
        error.message || "An error occurred while setting up the request.";
      showThrottledUniqueErrorToast(errorMessage);
    }

    console.error("Error Config:", error.config);
    return Promise.reject(errorMessage);
  }

  formatResponse = (response) => {
    return response.data;
  };

  get = async (url, config = {}) => {
    await this.init();
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
