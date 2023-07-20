import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PleaseWait from "../../../../../app/common/PleaseWait/PleaseWait";
import SectionHeading from "../../../../../app/common/SectionHeading/SectionHeading";
import { RootStoreContext } from "../../../../../app/stores/rootStore";
import { appColors } from "../../../../../colors";
import PhenotypicScreenSequenceTable from "./PhenotypicScreenSequenceTable/PhenotypicScreenSequenceTable";

/**
 * PhenotypicScreenSequence component displays the screen sequence of a phenotypic screen.
 * The actual table is rendered by the PhenotypicScreenSequenceTable component.
 * related to a phenotypic screen.
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.screenId - The id of the phenotypic screen.
 */
const PhenotypicScreenSequence = ({ screenId }) => {
  // Accessing the necessary properties from the rootStore
  const rootStore = useContext(RootStoreContext);
  const {
    isLoadingPhenotypicScreen,
    fetchPhenotypicScreen,
    selectedPhenotypicScreen,
  } = rootStore.screenPStore;

  const navigate = useNavigate();

  // Fetch the phenotypic screen data on component mount or when screenId changes
  useEffect(() => {
    if (
      selectedPhenotypicScreen === null ||
      selectedPhenotypicScreen.id !== screenId
    ) {
      console.log(
        "PhenotypicScreenSequence.js: fetchPhenotypicScreen: ",
        screenId
      );
      fetchPhenotypicScreen(screenId);
    }
  }, [selectedPhenotypicScreen, fetchPhenotypicScreen, screenId]);

  // Display a loading message while data is being fetched
  if (isLoadingPhenotypicScreen || selectedPhenotypicScreen === null) {
    return <PleaseWait />;
  }

  // Define the breadcrumb items
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
          heading={"Screens " + selectedPhenotypicScreen.screenName}
          entryPoint={selectedPhenotypicScreen.screenName}
          displayHorizon={true}
          color={appColors.sectionHeadingBg.screen}
        />
      </div>

      <div className="flex w-full">
        <PhenotypicScreenSequenceTable screenId={screenId} />
      </div>
    </div>
  );
};

export default observer(PhenotypicScreenSequence);
