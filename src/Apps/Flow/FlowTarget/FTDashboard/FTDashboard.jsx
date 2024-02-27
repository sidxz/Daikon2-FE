import React from "react";
import SecHeading from "../../../../Library/SecHeading/SecHeading";
import { appColors } from "../../../../constants/colors";
import FTDDataTable from "./FTDDataTable/FTDDataTable";
import FTDTargetMap from "./FTDTargetMap/FTDTargetMap";

const FTDashboard = () => {
  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500">
      <div className="flex w-full">
        <SecHeading
          icon="icon icon-common icon-target"
          heading="Targets"
          color={appColors.sectionHeadingBg.target}
          displayHorizon={true}
        />
      </div>
      <div className="flex w-full column-gap-5">
        <div className="flex ">
          <FTDTargetMap />
        </div>

        <div className="flex pl-4">
          <FTDDataTable />
        </div>
      </div>
    </div>
  );
};

export default FTDashboard;
