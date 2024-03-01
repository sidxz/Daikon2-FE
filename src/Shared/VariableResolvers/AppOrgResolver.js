import { useContext } from "react";
import { RootStoreContext } from "../../RootStore";

export const AppOrgResolver = () => {
  const rootStore = useContext(RootStoreContext);
  const { appVars } = rootStore.authStore;

  const getOrgNameById = (orgId) => {
    return appVars.orgs[orgId];
  };
  const getOrgIdByName = (orgName) => {
    return Object.keys(appVars.orgs).find(
      (key) => appVars.orgs[key] === orgName
    );
  };

  const getOrgAliasById = (orgId) => {
    return appVars.orgsAlias[orgId];
  };

  const getOrgIdByAlias = (orgAlias) => {
    return Object.keys(appVars.orgsAlias).find(
      (key) => appVars.orgsAlias[key] === orgAlias
    );
  };

  return { getOrgNameById, getOrgIdByName, getOrgAliasById, getOrgIdByAlias };
};
