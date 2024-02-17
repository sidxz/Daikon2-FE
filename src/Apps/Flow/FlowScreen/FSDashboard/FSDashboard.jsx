import { Sidebar } from "primereact/sidebar";
import React, { useContext, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import SecHeading from "../../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../../RootStore";
import { appColors } from "../../../../constants/colors";
import FSDAddScreen from "./FSDAddScreen/FSDAddScreen";
import FSDMenuBar from "./FSDMenuBar/FSDMenuBar";
import FSDOverview from "./FSDOverview/FSDOverview";
import FSDPhenotypic from "./FSDPhenotypic/FSDPhenotypic";
import FSDTargetBased from "./FSDTargetBased/FSDTargetBased";
const FSDashboard = () => {
  const rootStore = useContext(RootStoreContext);
  const navigate = useNavigate();

  const [displayAddSideBar, setDisplayAddSideBar] = useState(false);

  const addSideBarHeader = (
    <div className="flex align-items-center gap-2">
      <i className="icon icon-common icon-plus-circle"></i>
      <span className="font-bold">Add Screen</span>
    </div>
  );

  return (
    <>
      <div className="flex flex-column min-w-full fadein animation-duration-500">
        <div className="flex w-full">
          <SecHeading
            icon="icon icon-common icon-search"
            heading="Screens"
            color={appColors.sectionHeadingBg.screen}
            displayHorizon={true}
            customButtons={[
              {
                label: "Add Screen",
                icon: "pi pi-plus",
                action: () => setDisplayAddSideBar(true),
              },
            ]}
          />
        </div>
        <div className="flex w-full justify-content-center">
          <FSDMenuBar />
        </div>
        <div className="flex w-full">
          <Routes>
            <Route index element={<Navigate to="overview/" />} />
            <Route path="overview/*" element={<FSDOverview />} />
            <Route path="target-based/*" element={<FSDTargetBased />} />
            <Route path="phenotypic/*" element={<FSDPhenotypic />} />
          </Routes>
        </div>
      </div>
      <Sidebar
        visible={displayAddSideBar}
        position="right"
        onHide={() => setDisplayAddSideBar(false)}
        className="p-sidebar-md"
        header={addSideBarHeader}
      >
        <FSDAddScreen closeSideBar={() => setDisplayAddSideBar(false)} />
      </Sidebar>
    </>
  );
};

export default FSDashboard;
