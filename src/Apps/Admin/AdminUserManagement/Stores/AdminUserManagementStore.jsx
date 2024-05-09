import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
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

      updateUser: action,
      isUpdatingUser: observable,

      fetchOrgs: action,
      isFetchingOrgs: observable,
      orgRegistry: observable,
      isOrgRegistryCacheValid: observable,

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
  isUpdatingUser = false;
  selectedUser = null;

  isFetchingOrgs = false;
  isOrgRegistryCacheValid = false;
  orgRegistry = new Map();

  isFetchingOrg = false;
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

  updateUser = async (id, data) => {
    this.isUpdatingUser = true;
    try {
      await AdminUserAPI.update(id, data);
      runInAction(() => {
        this.userRegistry.set(id, data);
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
      console.log("store", orgs);
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

  updateOrg = async (id, data) => {
    this.isUpdatingOrg = true;
    try {
      await AdminOrgAPI.update(id, data);
      runInAction(() => {
        this.orgRegistry.set(id, data);
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
    return Array.from(this.userRegistry.values());
  }

  get orgList() {
    return Array.from(this.orgRegistry.values());
  }
}
