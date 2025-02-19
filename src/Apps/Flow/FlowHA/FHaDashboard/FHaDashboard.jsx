import React from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import SecHeading from "../../../../Library/SecHeading/SecHeading";
import { appColors } from "../../../../constants/colors";
import { HAIcon } from "../../icons/HAIcon";
import FHaDAllProjects from "./FHaDAllProjects/FHaDAllProjects";
import FHaDMenuBar from "./FHaDMenuBar/FHaDMenuBar";
import FHaDOverview from "./FHaDOverview/FHaDOverview";
import FHaDPaused from "./FHaDPaused/FHaDPaused";

const FHaDashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500">
      <div className="flex w-full">
        <SecHeading
          svgIcon={<HAIcon size={"25em"} />}
          heading="Hit Assessment"
          color={appColors.sectionHeadingBg.ha}
          displayHorizon={false}
          customButtons={[
            {
              label: "New Hit Assessment",
              icon: "pi pi-plus",
              action: () => navigate("/wf/ha/new"),
            },
          ]}
        />
      </div>
      <div className="flex w-full justify-content-center">
        <FHaDMenuBar />
      </div>

      <div className="flex w-full">
        <Routes>
          <Route index element={<Navigate to="overview/" />} />
          <Route path="overview/*" element={<FHaDOverview />} />
          <Route path="all-projects/*" element={<FHaDAllProjects />} />
          <Route path="paused/*" element={<FHaDPaused />} />
        </Routes>
      </div>
    </div>
  );
};

export default FHaDashboard;
