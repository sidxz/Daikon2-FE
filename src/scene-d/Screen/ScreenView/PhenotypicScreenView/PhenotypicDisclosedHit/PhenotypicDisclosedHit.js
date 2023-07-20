import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PleaseWait from "../../../../../app/common/PleaseWait/PleaseWait";
import SectionHeading from "../../../../../app/common/SectionHeading/SectionHeading";
import { RootStoreContext } from "../../../../../app/stores/rootStore";
import { appColors } from "../../../../../colors";
import PhenotypicDisclosedHitTable from "./PhenotypicDisclosedHitTable/PhenotypicDisclosedHitTable";

const PhenotypicDisclosedHit = ({ screenId }) => {
  /* MobX Store */
  const rootStore = useContext(RootStoreContext);

  const {
    isLoadingPhenotypicScreen,
    fetchPhenotypicScreen,
    selectedPhenotypicScreen,
  } = rootStore.screenPStore;

  const navigate = useNavigate();

  useEffect(() => {
    if (
      selectedPhenotypicScreen === null ||
      selectedPhenotypicScreen.id !== screenId
    ) {
      console.log("PhenotypicDisclosedHit.js: screenId: ", screenId);
      fetchPhenotypicScreen(screenId);
    }
  }, [selectedPhenotypicScreen, fetchPhenotypicScreen, screenId]);

  // Display a loading message while data is being fetched
  if (isLoadingPhenotypicScreen || selectedPhenotypicScreen === null) {
    return <PleaseWait />;
  }

  console.log(
    "PhenotypicDisclosedHit.js: selectedPhenotypicScreen: " +
      selectedPhenotypicScreen.id
  );

  const breadCrumbItems = [
    {
      label: "Screens",
      command: () => {
        navigate("/d/screen/");
      },
    },
    {
      label: selectedPhenotypicScreen.screenName,
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
          heading={"Disclosed Hits " + selectedPhenotypicScreen.screenName}
          entryPoint={selectedPhenotypicScreen.screenName}
          displayHorizon={true}
          color={appColors.sectionHeadingBg.screen}
        />
      </div>

      <div className="flex w-full">
        <PhenotypicDisclosedHitTable screenId={selectedPhenotypicScreen.id} />
      </div>
    </div>
  );
};

export default observer(PhenotypicDisclosedHit);
