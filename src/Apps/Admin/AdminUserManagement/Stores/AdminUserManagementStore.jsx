import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
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
    });
  }

  // Observables
  isFetchingUsers = false;
  isUserRegistryCacheValid = false;
  userRegistry = new Map();

  isFetchingUser = false;
  isUpdatingUser = false;
  selectedUser = null;

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

  // Computed
  get userList() {
    return Array.from(this.userRegistry.values());
  }
}
