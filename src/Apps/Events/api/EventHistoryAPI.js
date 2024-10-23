import AxiosWithAuth from "../../../Shared/Axios/AxiosWithAuth";
const axiosWithAuth = new AxiosWithAuth();

const EventHistoryAPI = {
  getMostRecent: () => axiosWithAuth.get("/v2/event-history"),
};

export default EventHistoryAPI;
