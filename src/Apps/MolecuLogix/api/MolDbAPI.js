import AxiosWithAuth from "../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const MolDbAPI = {
  listMolecules: () => axiosWithAuth.get("/v2/mol-db/molecules"),
  getMoleculeById: (id) => axiosWithAuth.get(`/v2/mol-db/molecule/by-id/${id}`),
};

export default MolDbAPI;
