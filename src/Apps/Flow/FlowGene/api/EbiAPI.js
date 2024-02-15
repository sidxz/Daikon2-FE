import AxiosGeneric from "../../../../Shared/Axios/AxiosGeneric";

const ebiBaseURL = "https://www.ebi.ac.uk/pdbe/api/pdb/entry/";

const axiosGeneric = new AxiosGeneric(null, ebiBaseURL, null);

const EbiAPI = {
  getLigands: (pdbID) => axiosGeneric.get(`ligand_monomers/${pdbID}`),
};

export default EbiAPI;
