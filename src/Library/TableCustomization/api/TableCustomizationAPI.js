import AxiosWithAuth from "../../../Shared/Axios/AxiosWithAuth";

const axiosWithAuth = new AxiosWithAuth();

const TableCustomizationAPI = {
  getTableDefaults: (tableType) =>
    axiosWithAuth.get(
      "/v2/user-preferences/table-customization/get-table-defaults",
      {
        params: {
          tableType,
        },
      }
    ),
  setTableDefaults: (customization) =>
    axiosWithAuth.post(
      "/v2/user-preferences/table-customization/set-table-defaults",
      customization
    ),

  resolve: (tableType, tableInstanceId) =>
    axiosWithAuth.get(`/v2/user-preferences/table-customization/resolve`, {
      params: {
        tableType,
        tableInstanceId,
      },
    }),

  setTableGlobal: (customization) =>
    axiosWithAuth.post(
      "/v2/user-preferences/table-customization/set-table-global",
      customization
    ),
  setUserCustomization: (customization) =>
    axiosWithAuth.post(
      "/v2/user-preferences/table-customization/set-user-customization",
      customization
    ),
  // axios sends a DELETE body only from config.data
  removeUserCustomization: (customization) =>
    axiosWithAuth.delete(
      `/v2/user-preferences/table-customization/remove-user-customization`,
      { data: customization }
    ),
};

export default TableCustomizationAPI;
