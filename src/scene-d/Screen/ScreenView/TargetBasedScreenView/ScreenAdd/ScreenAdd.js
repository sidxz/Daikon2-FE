import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { RootStoreContext } from "../../../../../app/stores/rootStore";
import TargetScreenPromotionQuestionnaire from "../../../../Target/TargetView/TargetScreenPromotionQuestionnaire/TargetScreenPromotionQuestionnaire";

const ScreenAdd = ({ TargetName, closeSidebar }) => {
  const rootStore = useContext(RootStoreContext);
  const { fetchTargetByName, displayLoading, selectedTarget } =
    rootStore.targetStore;

  useState(() => {
    if (selectedTarget === null || selectedTarget.name !== TargetName)
      console.log("ScreenAdd: use state", TargetName);
    fetchTargetByName(TargetName);
  }, [fetchTargetByName, TargetName, selectedTarget]);

  if (displayLoading) return <div>Please wait...</div>;

  const closePanel = () => {
    console.log("closePanel");
    closeSidebar();
  };

  console.log("ScreenAdd targetName: ", TargetName);
  console.log(selectedTarget);

  return (
    <TargetScreenPromotionQuestionnaire closeSidebar={() => closePanel()} />
  );

  //return <FailedLoading />;
};

export default observer(ScreenAdd);
