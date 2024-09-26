import AxiosWithAuth from "../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const MolDbAPI = {
  listMolecules: () => axiosWithAuth.get("/v2/molecule/"),
  getMoleculeById: (id) => axiosWithAuth.get(`/v2/molecule/${id}`),

  registerMolecule: (molecule) => axiosWithAuth.post("/v2/molecule/", molecule),
  updateMolecule: (molecule) =>
    axiosWithAuth.put(`/v2/molecule/${molecule.id}`, molecule),

  // updateMolecule: (molecule) =>
  //   axiosWithAuth.put("/v2/mol-db/molecule/update", molecule),

  // deleteMolecule: (id) =>
  //   axiosWithAuth.delete(`/v2/mol-db/molecule/delete/${id}`),

  findExactMolecule: (smiles) =>
    axiosWithAuth.get(`/v2/molecule/similar/${encodeURIComponent(smiles)}`, {
      params: { similarityThreshold: 1, maxResults: 1 },
    }),

  findSimilarMolecules: (queryString) =>
    axiosWithAuth.get(`/v2/molecule/similar?${queryString}`),

  findSubStructures: (queryString) =>
    axiosWithAuth.get(`/v2/molecule/substructure?${queryString}`),

  findByName: (queryString) =>
    axiosWithAuth.get(`/v2/molecule/by-name?${queryString}`),
};

export default MolDbAPI;
