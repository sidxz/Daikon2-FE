import { useContext } from "react";
import { RootStoreContext } from "../../RootStore";

export const GlobalValuesResolver = () => {
  const rootStore = useContext(RootStoreContext);
  const { globalValues } = rootStore.authStore;

  const getScreeningGlobals = () => {
    return globalValues?.appScreen;
  };

  return { getScreeningGlobals };
};
