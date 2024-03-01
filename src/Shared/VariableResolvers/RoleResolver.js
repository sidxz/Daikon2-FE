import { useContext } from "react";
import { RootStoreContext } from "../../RootStore";

export const RoleResolver = () => {
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
    return user.roles.map((roleId) => {
      return getRoleNameById(roleId);
    });
  };

  const isUserInRoleById = (roleId) => {
    return user.roles.includes(roleId);
  };

  const isUserInRoleByName = (roleName) => {
    return user.roles.includes(getRoleIdByName(roleName));
  };

  const isUserInAnyOfRoles = (roleNames) => {
    return user.roles.some((roleId) =>
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
