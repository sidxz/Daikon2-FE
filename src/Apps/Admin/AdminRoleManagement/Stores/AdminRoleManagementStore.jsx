import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { toast } from "react-toastify";
import AdminRolesAPI from "../api/AdminRolesAPI";

export default class AdminRoleManagementStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;

    makeObservable(this, {
      roleList: computed,
      isFetchingRoles: observable,
      fetchRoles: action,
      roleRegistry: observable,
      isRoleRegistryCacheValid: observable,

      fetchRole: action,
      isFetchingRole: observable,
      selectedRole: observable,

      addRole: action,
      isAddingRole: observable,

      updateRole: action,
      isUpdatingUser: observable,
    });
  }

  // Observables
  isFetchingRoles = false;
  isRoleRegistryCacheValid = false;
  roleRegistry = new Map();

  isFetchingRole = false;
  isAddingRole = false;
  isUpdatingUser = false;
  selectedRole = null;

  // Actions
  fetchRoles = async (inValidateCache = false) => {
    if (inValidateCache) {
      this.isRoleRegistryCacheValid = false;
    }
    if (this.isRoleRegistryCacheValid) {
      return;
    }
    this.isFetchingRoles = true;
    try {
      const roles = await AdminRolesAPI.list();
      runInAction(() => {
        roles.forEach((role) => {
          this.roleRegistry.set(role.id, role);
        });
        this.isRoleRegistryCacheValid = true;
      });
    } catch (error) {
      console.error("Error fetching roles", error);
    } finally {
      runInAction(() => {
        this.isFetchingRoles = false;
      });
    }
  };

  fetchRole = async (id) => {
    this.isFetchingRole = true;
    try {
      const role = await AdminRolesAPI.read(id);
      runInAction(() => {
        this.selectedRole = role;
      });
    } catch (error) {
      console.error("Error fetching role", error);
    } finally {
      runInAction(() => {
        this.isFetchingRole = false;
      });
    }
  };

  addRole = async (data) => {
    this.isAddingRole = true;
    try {
      const role = await AdminRolesAPI.create(data);
      runInAction(() => {
        this.roleRegistry.set(role.id, role);
        toast.success("Role added successfully");
      });
    } catch (error) {
      console.error("Error adding role", error);
    } finally {
      runInAction(() => {
        this.isAddingRole = false;
      });
    }
  };

  updateRole = async (data) => {
    this.isUpdatingUser = true;
    try {
      await AdminRolesAPI.update(data.id, data);
      runInAction(() => {
        this.roleRegistry.set(data.id, data);
        toast.success("Role updated successfully");
      });
    } catch (error) {
      console.error("Error updating role", error);
    } finally {
      runInAction(() => {
        this.isUpdatingUser = false;
      });
    }
  };

  // Computed
  get roleList() {
    let rList = Array.from(this.roleRegistry.values());
    // runInAction(() => {
    //   uList.map((u) => {
    //     u.appOrgAlias = this.rootStore.authStore.appVars.orgsAlias[u.appOrgId];
    //   });
    // });
    return rList;
  }
}
