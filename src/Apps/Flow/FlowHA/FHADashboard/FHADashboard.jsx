import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SecHeading from "../../../../Library/SecHeading/SecHeading";
import { appColors } from "../../../../constants/colors";
import FHADMenuBar from "./FHADMenuBar/FHADMenuBar";
import FHADOverview from "./FHADOverview/FHADOverview";

const FHADashboard = () => {
  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500">
      <div className="flex w-full">
        <SecHeading
          icon="icon icon-conceptual icon-chemical"
          heading="Hit Assessment"
          color={appColors.sectionHeadingBg.ha}
          displayHorizon={true}
        />
      </div>
      <div className="flex w-full justify-content-center">
        <FHADMenuBar />
      </div>

      <div className="flex w-full">
        <Routes>
          <Route index element={<Navigate to="overview/" />} />
          <Route path="overview/*" element={<FHADOverview />} />
        </Routes>
      </div>
    </div>
  );
};

export default FHADashboard;
