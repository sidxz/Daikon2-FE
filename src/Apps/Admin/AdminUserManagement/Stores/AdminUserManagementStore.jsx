import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { toast } from "react-toastify";
import AdminOrgAPI from "../api/AdminOrgAPI";
import AdminUserAPI from "../api/AdminUserAPI";

export default class AdminUserManagementStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;

    makeObservable(this, {
      userList: computed,
      isFetchingUsers: observable,
      fetchUsers: action,
      userRegistry: observable,
      isUserRegistryCacheValid: observable,

      fetchUser: action,
      isFetchingUser: observable,
      selectedUser: observable,

      addUser: action,
      isAddingUser: observable,

      updateUser: action,
      isUpdatingUser: observable,

      fetchOrgs: action,
      isFetchingOrgs: observable,
      orgRegistry: observable,
      isOrgRegistryCacheValid: observable,

      addOrg: action,
      isAddingOrg: observable,

      fetchOrg: action,
      isFetchingOrg: observable,
      selectedOrg: observable,

      updateOrg: action,
      isUpdatingOrg: observable,
    });
  }

  // Observables
  isFetchingUsers = false;
  isUserRegistryCacheValid = false;
  userRegistry = new Map();

  isFetchingUser = false;
  isAddingUser = false;
  isUpdatingUser = false;
  selectedUser = null;

  isFetchingOrgs = false;
  isOrgRegistryCacheValid = false;
  orgRegistry = new Map();

  isFetchingOrg = false;
  isAddingOrg = false;
  isUpdatingOrg = false;
  selectedOrg = null;

  // Actions
  fetchUsers = async (inValidateCache = false) => {
    if (inValidateCache) {
      this.isUserRegistryCacheValid = false;
    }
    if (this.isUserRegistryCacheValid) {
      return;
    }
    this.isFetchingUsers = true;
    try {
      const users = await AdminUserAPI.list();
      runInAction(() => {
        users.forEach((user) => {
          this.userRegistry.set(user.id, user);
        });
        this.isUserRegistryCacheValid = true;
      });
    } catch (error) {
      console.error("Error fetching users", error);
    } finally {
      runInAction(() => {
        this.isFetchingUsers = false;
      });
    }
  };

  fetchUser = async (id) => {
    this.isFetchingUser = true;
    try {
      const user = await AdminUserAPI.read(id);
      runInAction(() => {
        this.selectedUser = user;
      });
    } catch (error) {
      console.error("Error fetching user", error);
    } finally {
      runInAction(() => {
        this.isFetchingUser = false;
      });
    }
  };

  addUser = async (data) => {
    this.isAddingUser = true;
    try {
      const user = await AdminUserAPI.create(data);
      runInAction(() => {
        this.userRegistry.set(user.id, user);
        toast.success("User added successfully");
      });
    } catch (error) {
      console.error("Error adding user", error);
    } finally {
      runInAction(() => {
        this.isAddingUser = false;
      });
    }
  };

  updateUser = async (data) => {
    this.isUpdatingUser = true;
    try {
      await AdminUserAPI.update(data.id, data);
      runInAction(() => {
        this.userRegistry.set(data.id, data);
        toast.success("User updated successfully");
      });
    } catch (error) {
      console.error("Error updating user", error);
    } finally {
      runInAction(() => {
        this.isUpdatingUser = false;
      });
    }
  };

  fetchOrgs = async (inValidateCache = false) => {
    if (inValidateCache) {
      this.isOrgRegistryCacheValid = false;
    }
    if (this.isOrgRegistryCacheValid) {
      return;
    }
    this.isFetchingOrgs = true;
    try {
      const orgs = await AdminOrgAPI.list();
      //console.log("store", orgs);
      runInAction(() => {
        orgs.forEach((org) => {
          this.orgRegistry.set(org.id, org);
        });
        this.isOrgRegistryCacheValid = true;
      });
    } catch (error) {
      console.error("Error fetching orgs", error);
    } finally {
      runInAction(() => {
        this.isFetchingOrgs = false;
      });
    }
  };

  fetchOrg = async (id) => {
    this.isFetchingOrg = true;
    try {
      const org = await AdminOrgAPI.read(id);
      runInAction(() => {
        this.selectedOrg = org;
      });
    } catch (error) {
      console.error("Error fetching org", error);
    } finally {
      runInAction(() => {
        this.isFetchingOrg = false;
      });
    }
  };

  addOrg = async (data) => {
    this.isAddingOrg = true;
    try {
      const org = await AdminOrgAPI.create(data);
      runInAction(() => {
        this.orgRegistry.set(org.id, org);
        toast.success("Org Added successfully");
      });
    } catch (error) {
      console.error("Error adding org", error);
    } finally {
      runInAction(() => {
        this.isAddingOrg = false;
      });
    }
  };

  updateOrg = async (data) => {
    this.isUpdatingOrg = true;
    try {
      await AdminOrgAPI.update(data.id, data);
      runInAction(() => {
        this.orgRegistry.set(data.id, data);
        toast.success("Org updated successfully");
      });
    } catch (error) {
      console.error("Error updating org", error);
    } finally {
      runInAction(() => {
        this.isUpdatingOrg = false;
      });
    }
  };

  // Computed
  get userList() {
    let uList = Array.from(this.userRegistry.values());
    runInAction(() => {
      uList.map((u) => {
        u.appOrgAlias = this.rootStore.authStore.appVars.orgsAlias[u.appOrgId];
      });
    });
    return uList;
  }

  get orgList() {
    return Array.from(this.orgRegistry.values());
  }
}
