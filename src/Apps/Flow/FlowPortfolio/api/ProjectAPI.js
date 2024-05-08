import AxiosWithAuth from "../../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const ProjectAPI = {
  list: () => axiosWithAuth.get("/v2/project"),
  create: (project) => axiosWithAuth.post("/v2/project", project),
  update: (project) => axiosWithAuth.put(`/v2/project/${project.id}`, project),
  updateAssociation: (project) =>
    axiosWithAuth.put(`/v2/project/${project.id}/update-association`, project),
  delete: (id) => axiosWithAuth.delete(`/v2/project/${id}`),
  getById: (id) => axiosWithAuth.get(`/v2/project/by-id/${id}`),

  rename: (project) =>
    axiosWithAuth.put(`/v2/project/${project.id}/rename`, project),
};

export default ProjectAPI;
