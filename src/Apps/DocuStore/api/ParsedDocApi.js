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
};

export default ParsedDocApi;
