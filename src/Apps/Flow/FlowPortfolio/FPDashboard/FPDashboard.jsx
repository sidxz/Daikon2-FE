import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import SecHeading from "../../../../Library/SecHeading/SecHeading";
import { appColors } from "../../../../constants/colors";
import { PortfolioIcon } from "../../icons/PortfolioIcon";
import FPDAllPortfolioProjects from "./FPDAllPortfolioProjects/FPDAllPortfolioProjects";
import FPDMenuBar from "./FPDMenuBar/FPDMenuBar";
import FPDOverview from "./FPDOverview/FPDOverview";

const FPDashboard = () => {
  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500">
      <div className="flex w-full">
        <SecHeading
          svgIcon={<PortfolioIcon size={"25em"} />}
          heading="Portfolio"
          color={appColors.sectionHeadingBg.portfolio}
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
    </div>
  );
};

export default FPDashboard;
