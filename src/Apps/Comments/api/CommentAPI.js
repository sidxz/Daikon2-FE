import qs from "qs";
import AxiosWithAuth from "../../../Shared/Axios/AxiosWithAuth";
const axiosWithAuth = new AxiosWithAuth();

const CommentAPI = {
  list: () => axiosWithAuth.get("/v2/comment"),
  listByTags: (tags) => {
    return axiosWithAuth.get("/v2/comment/by-tags", {
      params: { tags },
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "repeat" }),
    });
  },
  create: (comment) => axiosWithAuth.post("/v2/comment", comment),
  update: (comment) => axiosWithAuth.put(`/v2/comment/${comment.id}`, comment),
  reply: (reply) =>
    axiosWithAuth.post(`/v2/comment/${reply.commentId}/reply`, reply),
  updateReply: (reply) =>
    axiosWithAuth.put(
      `/v2/comment/${reply.commentId}/update-reply/${reply.id}`,
      reply
    ),
  delete: (id) => axiosWithAuth.delete(`/v2/comment/${id}`),
  getById: (id) => axiosWithAuth.get(`/v2/comment/by-id/${id}`),
};

export default CommentAPI;
