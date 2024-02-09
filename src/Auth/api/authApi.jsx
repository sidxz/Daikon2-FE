import axios from "axios";
import AppUserManager from "../components/AppUserManager";

const testToken = async () => {
  const axiosAuth = axios.create({
    baseURL: "http://localhost:5010", // If you have a base URL for your API
    headers: {
      Accept: "application/json", // Ensures you expect JSON response
      "Content-Type": "application/json", // In case you send data to the server in JSON format
    },
  });

  const user = await AppUserManager.getUser();
  const accessToken = user ? user.access_token : null;

  console.log("axiosAuth : accessToken: ", accessToken);

  if (!accessToken) {
    console.error("No access token available");
    return; // Exit the function if there's no token
  }

  // Use interceptor to add token to requests
  axiosAuth.interceptors.request.use(
    (config) => {
      config.headers.Authorization = `Bearer ${accessToken}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Perform the API call
  axiosAuth
    .get("/v2/user/header")
    .then((response) => {
      console.log("axiosAuth : Identity response: ", response.data); // Use response.data to access the actual response body
    })
    .catch((error) => {
      if (error.response) {
        console.error("axiosAuth : Error response data: ", error.response.data);
        console.error(
          "axiosAuth : Error response status: ",
          error.response.status
        );
      } else if (error.request) {
        console.error("axiosAuth : No response received: ", error.request);
      } else {
        console.error("axiosAuth : Error message: ", error.message);
      }
    });
};

export default testToken;
