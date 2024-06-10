import { observer } from "mobx-react-lite";
import { Sidebar } from "primereact/sidebar";
import React, { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SecHeading from "../../../../Library/SecHeading/SecHeading";
import { AppRoleResolver } from "../../../../Shared/VariableResolvers/AppRoleResolver";
import { appColors } from "../../../../constants/colors";
import { PortfolioIcon } from "../../icons/PortfolioIcon";
import { PortfolioAdminRoleName } from "../constants/roles";
import FPDAddNew from "./FPDAddNew/FPDAddNew";
import FPDAllPortfolioProjects from "./FPDAllPortfolioProjects/FPDAllPortfolioProjects";
import FPDMenuBar from "./FPDMenuBar/FPDMenuBar";
import FPDOverview from "./FPDOverview/FPDOverview";
const FPDashboard = () => {
  const [displayAddSideBar, setDisplayAddSideBar] = useState(false);

  const { isUserInAnyOfRoles } = AppRoleResolver();

  const addSideBarHeader = (
    <div className="flex align-items-center gap-2">
      <i className="icon icon-common icon-plus-circle"></i>
      <span className="font-bold">New Portfolio Project</span>
    </div>
  );

  var titleBarButtons = [];
  if (isUserInAnyOfRoles([PortfolioAdminRoleName])) {
    titleBarButtons.push({
      label: "New Portfolio",
      icon: "pi pi-plus",
      action: () => setDisplayAddSideBar(true),
    });
  }

  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500">
      <div className="flex w-full">
        <SecHeading
          svgIcon={<PortfolioIcon size={"25em"} />}
          heading="Portfolio"
          color={appColors.sectionHeadingBg.portfolio}
          customButtons={titleBarButtons}
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
