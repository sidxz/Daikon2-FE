import AxiosWithAuth from "../../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const GeneAPI = {
  list: () => axiosWithAuth.get("/v2/gene"),
  getById: (id) => axiosWithAuth.get(`/v2/gene/by-id/${id}?WithMeta=true`),
  getByAccession: (accessionNo) =>
    axiosWithAuth.get(`/v2/gene/by-accession/${accessionNo}?WithMeta=true`),
};

export default GeneAPI;
