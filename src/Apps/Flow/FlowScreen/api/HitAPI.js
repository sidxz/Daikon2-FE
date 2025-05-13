import AxiosWithAuth from "../../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const HitAPI = {
  create: (hit) =>
    axiosWithAuth.post(`/v2/hit-collection/${hit.hitCollectionId}/hit`, hit),
  createBatch: (hitCollectionId, hits) =>
    axiosWithAuth.post(`/v2/hit-collection/${hitCollectionId}/hit/batch`, hits),
  update: (hit) =>
    axiosWithAuth.put(
      `/v2/hit-collection/${hit.hitCollectionId}/hit/${hit.id}`,
      hit
    ),
  updateBatch: (hitCollectionId, hits) =>
    axiosWithAuth.put(`/v2/hit-collection/${hitCollectionId}/hit/batch`, hits),
  delete: (hitCollectionId, hitId) =>
    axiosWithAuth.delete(`/v2/hit-collection/${hitCollectionId}/hit/${hitId}`),
  deleteBatch: (hitCollectionId, hitIds) =>
    axiosWithAuth.delete(`/v2/hit-collection/${hitCollectionId}/hit/batch`, {
      data: { hitIds },
    }),
  clusterHits: (hitCollectionId, clusterCutOff) =>
    axiosWithAuth.put(
      `/v2/hit-collection/${hitCollectionId}/cluster?CutOff=${clusterCutOff}`,
      {}
    ),
};

export default HitAPI;
