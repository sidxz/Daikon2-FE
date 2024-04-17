import { useContext } from "react";
import { RootStoreContext } from "../../RootStore";

export const AppUserResolver = () => {
  const rootStore = useContext(RootStoreContext);
  const { appVars } = rootStore.authStore;

  const getUserFullNameById = (userId) => {
    return appVars.userNames[userId];
  };

  return { getUserFullNameById };
};
