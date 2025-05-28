import { action, makeObservable, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import TableCustomizationAPI from "../api/TableCustomizationAPI";

export default class TableCustomizationStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      tableRegistry: observable,
      getCustomization: action,
      setCustomizationUser: action,
      setCustomizationGlobal: action,

      isFetchingTableCustomization: observable,
      isSavingUser: observable,
      isSavingGlobal: observable,
      removeUserCustomization: action,

      isCustomizationRegistryCacheValid: observable,

      selectedTableCustomization: observable,

      tableDefaultsRegistry: observable,
      getTableDefaults: action,
      setTableDefaults: action,
      isFetchingTableDefaults: observable,
      isSavingTableDefaults: observable,
      selectedTableDefaults: observable,
    });
  }

  // Observables
  tableRegistry = new Map();
  isFetchingTableCustomization = false;
  isSavingUser = false;
  isSavingGlobal = false;
  isCustomizationRegistryCacheValid = false;
  selectedTableCustomization = null;

  tableDefaultsRegistry = new Map();
  isFetchingTableDefaults = false;
  isSavingTableDefaults = false;
  selectedTableDefaults = null;

  // Actions

  getTableDefaults = async (tableType) => {
    console.log("getTableDefaults", tableType);
    this.isFetchingTableDefaults = true;
    // Return from cache if valid
    if (this.isCustomizationRegistryCacheValid) {
      const defaults = this.tableDefaultsRegistry.get(tableType);
      if (defaults) {
        runInAction(() => {
          this.isFetchingTableDefaults = false;
          this.selectedTableDefaults = defaults;
        });
        console.log("defaults from cache", defaults);
        return defaults;
      }
    }
    try {
      const defaults = await TableCustomizationAPI.getTableDefaults(tableType);
      runInAction(() => {
        this.tableDefaultsRegistry.set(tableType, defaults);
        this.selectedTableDefaults = defaults;
        this.isCustomizationRegistryCacheValid = true;
        this.isFetchingTableDefaults = false;
      });
      console.log("defaults from API", defaults);
      return defaults;
    } catch (error) {
      runInAction(() => {
        this.isFetchingTableDefaults = false;
        console.error("Error fetching table defaults:", error);
      });
      return []; // or `null` if you prefer
    } finally {
      runInAction(() => {
        this.isFetchingTableDefaults = false;
      });
    }
  };
  setTableDefaults = async (customization) => {
    this.isSavingTableDefaults = true;
    try {
      let res = await TableCustomizationAPI.setTableDefaults(customization);
      runInAction(() => {
        // Update the table registry with the new customization
        const { tableType } = res;
        this.tableDefaultsRegistry.set(tableType, res);
        this.selectedTableDefaults = res;
        this.isSavingTableDefaults = false;
      });
    } catch (error) {
      runInAction(() => {
        this.isSavingTableDefaults = false;
        console.error("Error saving table defaults:", error);
      });
    }
  };

  getCustomization = async (
    tableType,
    tableInstanceId,
    inValidateCache = false
  ) => {
    if (inValidateCache) {
      this.isCustomizationRegistryCacheValid = false;
    }

    this.isFetchingTableCustomization = true;

    // Return from cache if valid
    if (this.isCustomizationRegistryCacheValid) {
      const customization = this.tableRegistry.get(tableInstanceId);
      if (customization) {
        runInAction(() => {
          this.isFetchingTableCustomization = false;
          this.selectedTableCustomization = customization;
        });
        return customization;
      }
    }

    try {
      const customization = await TableCustomizationAPI.resolve(
        tableType,
        tableInstanceId
      );

      runInAction(() => {
        //console.log("customization api res", customization);
        this.tableRegistry.set(tableInstanceId, customization);
        this.selectedTableCustomization = customization;
        this.isCustomizationRegistryCacheValid = true;
      });

      return customization;
    } catch (error) {
      runInAction(() => {
        console.error("Error fetching table customization:", error);
      });
      return []; // or `null` if you prefer
    } finally {
      runInAction(() => {
        this.isFetchingTableCustomization = false;
      });
    }
  };

  setCustomizationUser = async (customization) => {
    this.isSavingUser = true;
    try {
      let res = await TableCustomizationAPI.setUserCustomization(customization);
      runInAction(() => {
        // Update the table registry with the new customization
        const { tableInstanceId } = res;
        res.level = "User"; // Set the level to user
        //console.log("res", res);
        this.tableRegistry.set(tableInstanceId, res);
        this.selectedTableCustomization = res;
        this.isCustomizationRegistryCacheValid = false; // Invalidate cache
        this.isSavingUser = false;
        toast.success("Customization saved successfully");
      });
    } catch (error) {
      runInAction(() => {
        this.isSavingUser = false;
        console.error("Error saving user customization:", error);
      });
    }
  };

  setCustomizationGlobal = async (customization) => {
    this.isSavingGlobal = true;
    try {
      let res = await TableCustomizationAPI.setTableGlobal(customization);
      runInAction(() => {
        // Update the table registry with the new customization
        const { tableInstanceId } = res;
        res.level = "Global"; // Set the level to global
        this.tableRegistry.set(tableInstanceId, res);
        this.selectedTableCustomization = res;
        this.isCustomizationRegistryCacheValid = false; // Invalidate cache
        this.isSavingGlobal = false;
        toast.success("Customization saved for all users.");
      });
    } catch (error) {
      runInAction(() => {
        this.isSavingGlobal = false;
        console.error("Error saving global customization:", error);
      });
    }
  };

  removeUserCustomization = async (customization) => {
    this.isSavingUser = true;
    try {
      console.log("customization", customization);
      var res = await TableCustomizationAPI.removeUserCustomization(
        customization
      );
      runInAction(() => {
        // Remove the customization from the registry
        console.log("res", res);
        const { tableInstanceId } = customization;
        this.tableRegistry.delete(tableInstanceId);
        this.isCustomizationRegistryCacheValid = false; // Invalidate cache
        this.isSavingUser = false;
        toast.success("Restored to default successfully");
      });
    } catch (error) {
      runInAction(() => {
        this.isSavingUser = false;
        console.error("Error removing user customization:", error);
      });
    }
  };
}
