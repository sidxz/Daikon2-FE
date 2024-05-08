import AxiosWithAuth from "../../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const TargetHorizonAPI = {
  listTargetRelations: () =>
    axiosWithAuth.get("/v2/horizon/list-target-relations"),
};

export default TargetHorizonAPI;
