import AxiosWithAuth from "../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const MolDbAPI = {
  getMoleculeById: (id) => axiosWithAuth.get(`/v2/molecule/${id}`),
  getMoleculesByIds: (ids) =>
    axiosWithAuth.post("/v2/molecule/by-ids", { IDs: ids }),

  registerMolecule: (molecule) => axiosWithAuth.post("/v2/molecule/", molecule),
  updateMolecule: (molecule) =>
    axiosWithAuth.put(`/v2/molecule/${molecule.id}`, molecule),

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

  discloseMoleculePreview: (molecules) =>
    axiosWithAuth.post("/v2/molecule/disclose-molecule-preview", {
      queries: molecules,
    }),
  discloseMolecules: (molecules) =>
    axiosWithAuth.put("/v2/molecule/disclose-batch", {
      molecules: molecules,
    }),

  registerMoleculePreview: (molecules) =>
    axiosWithAuth.post("/v2/molecule/register-molecule-preview", {
      queries: molecules,
    }),

  registerMoleculeBatch: (commands, options = {}) =>
    axiosWithAuth.post("/v2/molecule/batch", commands, options),

  getRecentDisclosures: (params) =>
    axiosWithAuth.get("/v2/aggregators/disclosure/generate-dashboard", {
      params: params,
    }),

  explainNuisance: (nuisanceDto) =>
    axiosWithAuth.post("/v2/molecule/explain-nuisance", nuisanceDto),
};

export default MolDbAPI;
