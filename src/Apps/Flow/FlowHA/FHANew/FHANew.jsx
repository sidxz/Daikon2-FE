import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import SecHeading from "../../../../Library/SecHeading/SecHeading";
import { appColors } from "../../../../constants/colors";
import { HAIcon } from "../../icons/HAIcon";
import FHANewBaseHitData from "./components/FHANewBaseHitData/FHANewBaseHitData";
import FHaNewHitPicker from "./components/FHaNewHitPicker/FHaNewHitPicker";

const FHANew = () => {
  const [baseHitData, setBaseHitData] = useState(null);

  console.log("FHANew -> baseHitData", baseHitData);
  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500 gap-1">
      <div className="flex w-full">
        <SecHeading
          svgIcon={<HAIcon size={"25em"} />}
          heading="New Hit Assessment"
          color={appColors.sectionHeadingBg.ha}
          displayHorizon={false}
        />
      </div>
      <div className="flex w-full m-2">
        {baseHitData == null ? (
          <FHaNewHitPicker
            baseHitData={baseHitData}
            setBaseHitData={setBaseHitData}
          />
        ) : (
          <FHANewBaseHitData baseHitData={baseHitData} />
        )}
      </div>
    </div>
  );
};

export default observer(FHANew);
