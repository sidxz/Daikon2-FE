import AxiosWithAuth from "../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const MolDbAPI = {
  listMolecules: () => axiosWithAuth.get("/v2/mol-db/molecules"),
  getMoleculeById: (id) => axiosWithAuth.get(`/v2/mol-db/molecule/by-id/${id}`),

  registerMolecule: (molecule) =>
    axiosWithAuth.post("/v2/mol-db/molecule/register", molecule),

  // updateMolecule: (molecule) =>
  //   axiosWithAuth.put("/v2/mol-db/molecule/update", molecule),

  // deleteMolecule: (id) =>
  //   axiosWithAuth.delete(`/v2/mol-db/molecule/delete/${id}`),

  findExactMolecule: (smiles) =>
    axiosWithAuth.get(`/v2/mol-db/molecule/find-exact/${smiles}`),

  findSimilarMolecules: (smiles, threshold, limit) =>
    axiosWithAuth.get(`/v2/mol-db/molecule/find-similar/${smiles}`, {
      params: { threshold, limit },
    }),
};

export default MolDbAPI;
