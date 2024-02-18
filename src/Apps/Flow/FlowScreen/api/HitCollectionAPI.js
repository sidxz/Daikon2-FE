import AxiosWithAuth from "../../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const HitCollectionAPI = {
  create: (hitCollection) =>
    axiosWithAuth.post("/v2/hit-collection", hitCollection),
  update: (hitCollection) =>
    axiosWithAuth.put(`/v2/hit-collection/${hitCollection.id}`, hitCollection),
  delete: (id) => axiosWithAuth.delete(`/v2/hit-collection/${id}`),
};

export default HitCollectionAPI;
