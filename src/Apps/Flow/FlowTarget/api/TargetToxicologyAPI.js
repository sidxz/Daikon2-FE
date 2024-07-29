import AxiosWithAuth from "../../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const TargetToxicologyAPI = {
  list: () => axiosWithAuth.get("/v2/target/toxicology?WithMeta=true"),
  getByTargetId: (targetId) =>
    axiosWithAuth.get(`/v2/target/${targetId}/toxicology?WithMeta=true`),
  create: (toxicology) =>
    axiosWithAuth.post(
      `/v2/target/${toxicology.targetId}/toxicology`,
      toxicology
    ),
  update: (toxicology) =>
    axiosWithAuth.put(
      `/v2/target/${toxicology.targetId}/toxicology/${toxicology.toxicologyId}`,
      toxicology
    ),
  delete: (targetId, toxicologyId) =>
    axiosWithAuth.delete(`/v2/target/${targetId}/toxicology/${toxicologyId}`),
  batchAddOrUpdate: (toxicologies) =>
    axiosWithAuth.post(
      `/v2/target/toxicology/batch-add-update-toxicity`,
      toxicologies
    ),
};

export default TargetToxicologyAPI;
