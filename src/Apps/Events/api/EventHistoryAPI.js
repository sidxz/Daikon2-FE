import AxiosWithAuth from "../../../Shared/Axios/AxiosWithAuth";
const axiosWithAuth = new AxiosWithAuth();

const EventHistoryAPI = {
  getMostRecent: (refreshCache = false) =>
    axiosWithAuth.get("/v2/event-history", {
      params: { refreshCache },
    }),
};

export default EventHistoryAPI;
