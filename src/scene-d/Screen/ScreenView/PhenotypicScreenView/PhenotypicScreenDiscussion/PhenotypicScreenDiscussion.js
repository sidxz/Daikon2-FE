import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Discussion from "../../../../../app/common/Discussion/Discussion";
import PleaseWait from "../../../../../app/common/PleaseWait/PleaseWait";
import SectionHeading from "../../../../../app/common/SectionHeading/SectionHeading";
import { RootStoreContext } from "../../../../../app/stores/rootStore";
import { appColors } from "../../../../../colors";

const PhenotypicScreenDiscussion = ({ screenId }) => {
  const navigate = useNavigate();

  const rootStore = useContext(RootStoreContext);
  const { appVars } = rootStore.generalStore;
  const {
    isLoadingPhenotypicScreen,
    fetchPhenotypicScreen,
    selectedPhenotypicScreen,
  } = rootStore.screenPStore;

  // Fetch the phenotypic screen data on component mount or when screenId changes
  useEffect(() => {
    if (
      selectedPhenotypicScreen === null ||
      selectedPhenotypicScreen.id !== screenId
    ) {
      fetchPhenotypicScreen(screenId);
    }
  }, [selectedPhenotypicScreen, fetchPhenotypicScreen, screenId]);

  // Display a loading message while data is being fetched
  if (isLoadingPhenotypicScreen || selectedPhenotypicScreen === null) {
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
      label: selectedPhenotypicScreen.screenName,
      command: () => {
        navigate("/d/screen/phenotypic/" + selectedPhenotypicScreen.id);
      },
    },
    { label: "Discussion" },
  ];

  return (
    <div className="flex flex-column w-full">
      <div className="flex w-full pb-2">
        <BreadCrumb model={breadCrumbItems} />
      </div>
      <div className="flex w-full">
        <SectionHeading
          icon="icon icon-common icon-target"
          heading={selectedPhenotypicScreen.screenName}
          //entryPoint={baseScreenName}
          displayHorizon={false}
          color={appColors.sectionHeadingBg.screen}
        />
      </div>
      <div className="flex w-full">
        <Discussion
          reference={selectedPhenotypicScreen.screenName}
          section={"Screen"}
        />
      </div>
    </div>
  );
};

export default observer(PhenotypicScreenDiscussion);
