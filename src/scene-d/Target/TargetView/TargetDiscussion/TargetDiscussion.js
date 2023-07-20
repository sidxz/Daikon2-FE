import { BreadCrumb } from "primereact/breadcrumb";
import React from "react";
import { useNavigate } from "react-router-dom";
import Discussion from "../../../../app/common/Discussion/Discussion";
import SectionHeading from "../../../../app/common/SectionHeading/SectionHeading";
import { appColors } from "../../../../colors";

// Component for displaying the discussion related to a target
const TargetDiscussion = ({ selectedTarget }) => {
  const navigate = useNavigate();

  // Define breadcrumb items for navigation
  const breadCrumbItems = [
    {
      label: "Targets",
      // Navigate to "/d/target/" when "Targets" breadcrumb is clicked
      command: () => {
        navigate("/d/target/");
      },
    },
    {
      label: selectedTarget.name,
      // Navigate to "/d/target/{selectedTarget.id}" when target name breadcrumb is clicked
      command: () => {
        navigate(`/d/target/${selectedTarget.id}`);
      },
    },
    { label: "Discussion" },
  ];

  return (
    <div className="flex flex-column w-full">
      <div className="flex w-full pb-2">
        {/* Display the breadcrumb */}
        <BreadCrumb model={breadCrumbItems} />
      </div>
      <div className="flex w-full">
        {/* Display the section heading */}
        <SectionHeading
          icon="icon icon-common icon-target"
          heading={selectedTarget.name}
          entryPoint={selectedTarget.name}
          displayHorizon={true}
          color={appColors.sectionHeadingBg.target}
        />
      </div>
      <div className="flex w-full">
        <Discussion reference={selectedTarget.name} section={"Target"} />
      </div>
    </div>
  );
};

export default TargetDiscussion;
