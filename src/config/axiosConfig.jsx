export const AxiosConfig = {
  baseURL: "http://localhost:5010", // If you have a base URL for your API
  headers: {
    Accept: "application/json", // Ensures you expect JSON response
    "Content-Type": "application/json", // In case you send data to the server in JSON format
  },
};
