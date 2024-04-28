import AxiosWithAuth from "../../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const ScreenViewAPI = {
  hitView: (hitId) => axiosWithAuth.get(`/v2/hit-collection/view/hit/${hitId}`),
};

export default ScreenViewAPI;
