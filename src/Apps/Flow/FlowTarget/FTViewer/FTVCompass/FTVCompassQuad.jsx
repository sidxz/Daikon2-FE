import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import Loading from "../../../../../Library/Loading/Loading";
import RichTextEdit from "../../../../../Library/RichTextEdit/RichTextEdit";
import { RootStoreContext } from "../../../../../RootStore";

const FTVCompassQuad = () => {
  const rootStore = useContext(RootStoreContext);

  const {
    fetchTarget,
    selectedTarget,
    isFetchingTarget,
    isTargetRegistryCacheValid,
  } = rootStore.targetStore;

  const [targetData, setTargetData] = useState(selectedTarget);

  if (isFetchingTarget) {
    return <Loading message={"Fetching Target..."} />;
  }

  let editTargetSummary = (data) => {
    console.log("editTargetSummary");
    console.log(data);
  };

  let cancelEditTargetSummary = () => {
    console.log("cancelEditTargetSummary");
  };

  return (
    <div>
      <RichTextEdit
        baseData={targetData}
        dataSelector={"background"}
        onSave={editTargetSummary}
      />
    </div>
  );
};

export default observer(FTVCompassQuad);
