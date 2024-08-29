import AxiosWithAuth from "../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const GraphMolAPI = {
  findMoleculeRelations: (id) =>
    axiosWithAuth.get(`/v2/horizon/find-molecule-relations/${id}`),
};

export default GraphMolAPI;
