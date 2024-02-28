import AxiosWithAuth from "../../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const HitAPI = {
  create: (hit) =>
    axiosWithAuth.post(`/v2/hit-collection/${hit.hitCollectionId}/hit`, hit),
  update: (hit) =>
    axiosWithAuth.put(
      `/v2/hit-collection/${hit.hitCollectionId}/hit/${hit.id}`,
      hitCollection
    ),
  delete: (hitCollectionId, hitId) =>
    axiosWithAuth.delete(`/v2/hit-collection/${hitCollectionId}/hit/${hitId}`),
};

export default HitAPI;
