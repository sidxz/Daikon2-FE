import AxiosWithAuth from "../../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const ProjectAPI = {
  list: () => axiosWithAuth.get("/v2/project"),
  create: (ha) => axiosWithAuth.post("/v2/project", project),
  update: (ha) => axiosWithAuth.put(`/v2/project/${project.id}`, project),
  delete: (id) => axiosWithAuth.delete(`/v2/project/${id}`),
  getById: (id) => axiosWithAuth.get(`/v2/project/by-id/${id}`),
};

export default ProjectAPI;
