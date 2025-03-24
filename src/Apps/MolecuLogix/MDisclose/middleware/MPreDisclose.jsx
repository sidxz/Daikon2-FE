import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { appColors } from "../../../../constants/colors";
import SecHeading from "../../../../Library/SecHeading/SecHeading";
import { DiscloseIcon } from "../../Icons/DiscloseIcon";

const MPreDisclose = () => {
  const [searchParams, setSearchParams] = useSearchParams(); // ✅ Get and set URL parameters

  // ✅ Extract `inputName` from URL (can be string or array)
  const inputNameParam = searchParams.getAll("inputName");
  const inputIdParam = searchParams.getAll("inputId");

  console.log("inputNameParam", inputNameParam);
  console.log("inputIdParam", inputIdParam);

  // ✅ Initialize state based on URL or default
  const [inputs, setInputs] = useState(() => {
    if (inputNameParam.length > 0) {
      return inputNameParam.map((name) => ({
        name: name.trim(),
        SMILES: "Click to Edit",
        CDDId: "",
      }));
    }
    return [{ name: "Click to Edit", SMILES: "Click to Edit", CDDId: "" }];
  });

  return (
    <div className="flex flex-column w-full gap-2">
      <div className="flex w-full">
        <SecHeading
          svgIcon={<DiscloseIcon size={"25em"} />}
          heading={"Disclose Compounds"}
          displayHorizon={false}
          color={appColors.molecuLogix.disclose}
        />
      </div>
      <div className="flex justify-content-center w-full"></div>
    </div>
  );
};

export default observer(MPreDisclose);
