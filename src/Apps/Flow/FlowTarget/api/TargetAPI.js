import AxiosWithAuth from "../../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const TargetAPI = {
  list: () => axiosWithAuth.get("/v2/target"),
  getById: (id) => axiosWithAuth.get(`/v2/target/by-id/${id}`),
  create: (target) => axiosWithAuth.post("/v2/target", target),
  update: (target) => axiosWithAuth.put(`/v2/target/${target.id}`, target),
  delete: (id) => axiosWithAuth.delete(`/v2/target/${id}`),
  updateAssociatedGenes: (target) =>
    axiosWithAuth.put(
      `/v2/target/${target.id}/update-associated-genes`,
      target
    ),
};

export default TargetAPI;
