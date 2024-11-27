import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import React from "react";
import { useNavigate } from "react-router-dom";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import { appColors } from "../../../../../constants/colors";
import ParsedDocsByTags from "../../../../DocuStore/ParsedDocsByTags/ParsedDocsByTags";
import { TargetIcon } from "../../../icons/TargetIcon";

const FTVDocs = ({ selectedTarget }) => {
  const navigate = useNavigate();
  const breadCrumbItems = [
    {
      label: "Targets",
      command: () => {
        navigate("/wf/target/");
      },
    },
    {
      label: selectedTarget.name,
      command: () => {
        navigate(`/wf/target/viewer/${selectedTarget.id}`);
      },
    },
    { label: "Docs" },
  ];

  return (
    <div className="flex flex-column w-full">
      <div className="flex w-full">
        <BreadCrumb model={breadCrumbItems} />
      </div>
      <div className="flex w-full">
        <SecHeading
          svgIcon={<TargetIcon size={"25em"} />}
          heading={"Target - " + selectedTarget.name}
          color={appColors.sectionHeadingBg.target}
          displayHorizon={true}
          entryPoint={selectedTarget?.id}
        />
      </div>
      <div className="flex w-full pt-1">
        <ParsedDocsByTags tags={[selectedTarget.name]} />
      </div>
    </div>
  );
};

export default observer(FTVDocs);
