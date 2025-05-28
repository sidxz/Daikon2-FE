import qs from "qs";
import AxiosWithAuth from "../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const MolDbAPI = {
  getMoleculeById: (id) => axiosWithAuth.get(`/v2/molecule/${id}`),
  getMoleculesByIds: (ids) =>
    axiosWithAuth.get("/v2/molecule/by-ids", {
      params: { IDs: ids },
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "repeat" }),
    }),

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
};

export default MolDbAPI;
