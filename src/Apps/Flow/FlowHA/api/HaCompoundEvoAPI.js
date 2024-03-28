import AxiosWithAuth from "../../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const HaCompoundEvoAPI = {
  add: (ce) =>
    axiosWithAuth.post(
      `/v2/hit-assessment/${ce.hitAssessmentId}/compound-evolution`,
      ce
    ),
  update: (ce) =>
    axiosWithAuth.put(
      `/v2/hit-assessment/${ce.hitAssessmentId}/compound-evolution/${ce.id}`,
      ce
    ),
  delete: (hitAssessmentId, id) =>
    axiosWithAuth.delete(
      `/v2/hit-assessment/${hitAssessmentId}/compound-evolution/${id}`
    ),
};

export default HaCompoundEvoAPI;
