import { observer } from "mobx-react-lite";
import { Sidebar } from "primereact/sidebar";
import React, { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SecHeading from "../../../../Library/SecHeading/SecHeading";
import { appColors } from "../../../../constants/colors";
import { PortfolioIcon } from "../../icons/PortfolioIcon";
import FPDAddNew from "./FPDAddNew/FPDAddNew";
import FPDAllPortfolioProjects from "./FPDAllPortfolioProjects/FPDAllPortfolioProjects";
import FPDMenuBar from "./FPDMenuBar/FPDMenuBar";
import FPDOverview from "./FPDOverview/FPDOverview";
const FPDashboard = () => {
  const [displayAddSideBar, setDisplayAddSideBar] = useState(false);

  const addSideBarHeader = (
    <div className="flex align-items-center gap-2">
      <i className="icon icon-common icon-plus-circle"></i>
      <span className="font-bold">New Portfolio Project</span>
    </div>
  );

  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500">
      <div className="flex w-full">
        <SecHeading
          svgIcon={<PortfolioIcon size={"25em"} />}
          heading="Portfolio"
          color={appColors.sectionHeadingBg.portfolio}
          customButtons={[
            {
              label: "New Portfolio",
              icon: "pi pi-plus",
              action: () => setDisplayAddSideBar(true),
            },
          ]}
          displayHorizon={false}
        />
      </div>
      <div className="flex w-full justify-content-center">
        <FPDMenuBar />
      </div>

      <div className="flex w-full">
        <Routes>
          <Route index element={<Navigate to="overview/" />} />
          <Route path="overview/*" element={<FPDOverview />} />
          <Route
            path="all-portfolio-projects/*"
            element={<FPDAllPortfolioProjects />}
          />
        </Routes>
      </div>

      <Sidebar
        visible={displayAddSideBar}
        position="right"
        onHide={() => setDisplayAddSideBar(false)}
        className="p-sidebar-sm"
        header={addSideBarHeader}
      >
        <FPDAddNew closeSideBar={() => setDisplayAddSideBar(false)} />
      </Sidebar>
    </div>
  );
};

export default observer(FPDashboard);
