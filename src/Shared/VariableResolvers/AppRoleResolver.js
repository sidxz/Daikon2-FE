import { useContext } from "react";
import { RootStoreContext } from "../../RootStore";

export const AppRoleResolver = () => {
  const rootStore = useContext(RootStoreContext);
  const { appVars, user } = rootStore.authStore;

  const getRoleNameById = (roleId) => {
    return appVars.roles[roleId];
  };
  const getRoleIdByName = (roleName) => {
    return Object.keys(appVars.roles).find(
      (key) => appVars.roles[key] === roleName
    );
  };

  const getUserRoleNames = () => {
    return user.appRoleIds.map((roleId) => {
      return getRoleNameById(roleId);
    });
  };

  const isUserInRoleById = (roleId) => {
    return user.appRoleIds.includes(roleId);
  };

  const isUserInRoleByName = (roleName) => {
    return (
      user.appRoleIds.includes(getRoleIdByName(roleName)) ||
      user.appRoleIds.includes(getRoleIdByName("ROOT"))
    );
  };

  const isUserInAnyOfRoles = (roleNames) => {
    return user.appRoleIds.some((roleId) =>
      roleNames.includes(getRoleNameById(roleId))
    );
  };

  return {
    getRoleNameById,
    getRoleIdByName,
    getUserRoleNames,
    isUserInRoleById,
    isUserInRoleByName,
    isUserInAnyOfRoles,
  };
};
