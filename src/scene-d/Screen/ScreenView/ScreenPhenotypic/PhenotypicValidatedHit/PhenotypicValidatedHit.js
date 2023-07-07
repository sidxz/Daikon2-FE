import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PleaseWait from "../../../../../app/common/PleaseWait/PleaseWait";
import SectionHeading from "../../../../../app/common/SectionHeading/SectionHeading";
import { RootStoreContext } from "../../../../../app/stores/rootStore";
import { appColors } from "../../../../../colors";
import PhenotypicValidatedHitTable from "./PhenotypicValidatedHitTable/PhenotypicValidatedHitTable";

const PhenotypicValidatedHit = ({ screenId }) => {
  /* MobX Store */
  const rootStore = useContext(RootStoreContext);
  const { appVars } = rootStore.generalStore;
  const { loadingFetchScreen, fetchScreen, selectedScreen } =
    rootStore.screenStore;

  const navigate = useNavigate();

  useEffect(() => {
    console.log(
      "PhenotypicScreenValdiatedHit.js: useEffect screenId: ",
      screenId
    );
    if (selectedScreen === null || selectedScreen.id !== screenId)
      fetchScreen(screenId);
  }, [selectedScreen, fetchScreen, screenId]);

  if (loadingFetchScreen || selectedScreen === null) {
    return <PleaseWait />;
  }

  const breadCrumbItems = [
    {
      label: "Screens",
      command: () => {
        navigate("/d/screen/");
      },
    },
    {
      label: selectedScreen.screenName,
      command: () => {
        // navigate(`/d/gene/${gene.id}`);
      },
    },
  ];

  return (
    <div className="flex flex-column w-full">
      <div className="flex w-full pb-2">
        <BreadCrumb model={breadCrumbItems} />
      </div>
      <div className="flex w-full">
        <SectionHeading
          icon="icon icon-common icon-search"
          heading={"Disclosed Hits " + selectedScreen.screenName}
          entryPoint={selectedScreen.screenName}
          displayHorizon={true}
          color={appColors.sectionHeadingBg.screen}
        />
      </div>

      <div className="flex w-full">
        <PhenotypicValidatedHitTable screenId={screenId} />
      </div>
    </div>
  );
};

export default observer(PhenotypicValidatedHit);
