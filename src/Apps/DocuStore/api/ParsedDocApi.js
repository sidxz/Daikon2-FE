import qs from "qs";
import AxiosWithAuth from "../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const ParsedDocApi = {
  /**
   * Fetch documents by tags with optional parameters
   * @param {string[]} tags - Tags to filter documents
   * @param {boolean} withMeta - Include metadata (default: true)
   * @returns {Promise} Axios GET request promise
   */
  listByTags: (tags, withMeta = true) => {
    return axiosWithAuth.get("/v2/docu-store/parsed-docs/by-tags", {
      params: { tags, withMeta },
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "repeat" }),
    });
  },

  getById: (docId, withMeta = true) => {
    return axiosWithAuth.get(`/v2/docu-store/parsed-docs/by-id/${docId}`, {
      params: { withMeta },
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "repeat" }),
    });
  },

  editDoc: (data) => {
    console.log("Editing document:", data);
    return axiosWithAuth.put(`/v2/docu-store/parsed-docs/`, data);
  },

  getRevisionHistory: (docId, withMeta = true) => {
    return axiosWithAuth.get(`/v2/event-history/aggregate-history`, {
      params: {
        AggregateId: docId,
        withMeta: withMeta,
      },
    });
  },
};

export default ParsedDocApi;
