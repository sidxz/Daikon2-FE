import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import { TabPanel, TabView } from "primereact/tabview";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FormatScreenName } from "../../../../../app/common/Functions/Formats";
import SectionHeading from "../../../../../app/common/SectionHeading/SectionHeading";
import Loading from "../../../../../app/layout/Loading/Loading";
import { RootStoreContext } from "../../../../../app/stores/rootStore";
import { appColors } from "../../../../../colors";
import ValidatedHitsList from "./ValidatedHitsList/ValidatedHitsList";
const ValidatedHits = ({ TargetName }) => {
  /* MobX Store */
  const rootStore = useContext(RootStoreContext);
  const {
    displayLoading,
    filterTargetBasedScreensByTarget,
    filteredScreens,
    validatedHitsIndex,
    setValidatedHitsIndex,
    selectedScreenTargetFilter,
    isTgScreenRegistryCacheValid,
  } = rootStore.screenTStore;

  const navigate = useNavigate();

  useEffect(() => {
    if (
      filteredScreens === null ||
      filteredScreens.length === 0 ||
      selectedScreenTargetFilter !== TargetName ||
      !isTgScreenRegistryCacheValid
    )
      filterTargetBasedScreensByTarget(TargetName);
  }, [
    filteredScreens,
    filterTargetBasedScreensByTarget,
    TargetName,
    isTgScreenRegistryCacheValid,
    selectedScreenTargetFilter,
  ]);

  if (displayLoading) {
    return <Loading />;
  }

  const breadCrumbItems = [
    {
      label: "Screens",
      command: () => {
        navigate("/d/screen/");
      },
    },
    {
      label: TargetName,
      command: () => {
        navigate(`/d/screen/target-based/${TargetName}`);
      },
    },
    {
      label: "Validated Hits",
    },
  ];

  // let filteredScreensByTarget = filterTargetBasedScreensByTarget(TargetName);
  let tabs = [];

  if (tabs.length === 0 && filteredScreens.length > 0) {
    filteredScreens.forEach((screen) => {
      tabs.push(
        <TabPanel
          header={FormatScreenName(screen)}
          key={screen.id}
          className="max-w-screen"
        >
          <ValidatedHitsList screenId={screen.id} />
        </TabPanel>
      );
    });
  }

  return (
    <div className="flex flex-column w-full">
      <div className="flex w-full pb-2">
        <BreadCrumb model={breadCrumbItems} />
      </div>
      <div className="flex w-full">
        <SectionHeading
          icon="icon icon-common icon-search"
          heading={"Screens of " + TargetName}
          entryPoint={TargetName}
          displayHorizon={true}
          color={appColors.sectionHeadingBg.screen}
        />
      </div>
      <div className="flex w-full">
        <SectionHeading
          icon="icon icon-conceptual icon-structures-3d"
          heading={"Validated Hits"}
          color={"#f4f4f4"}
          textColor={"#000000"}
        />
      </div>
      <div className="flex w-full">
        <TabView
          activeIndex={validatedHitsIndex}
          onTabChange={(e) => setValidatedHitsIndex(e.index)}
          scrollable
          className="max-w-full w-full"
        >
          {tabs}
        </TabView>
      </div>
    </div>
  );
};

export default observer(ValidatedHits);
