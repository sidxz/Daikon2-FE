import { BreadCrumb } from "primereact/breadcrumb";
import React from "react";
import { useNavigate } from "react-router-dom";
import Discussion from "../../../../app/common/Discussion/Discussion";
import { ExtractBaseScreenNameFromScreen } from "../../../../app/common/Functions/Formats";
import SectionHeading from "../../../../app/common/SectionHeading/SectionHeading";
import { appColors } from "../../../../colors";

const PostPortfolioDiscussion = ({ project }) => {
  const navigate = useNavigate();

  // Array of breadcrumb items
  const breadCrumbItems = [
    {
      label: "Post Portfolio",
      command: () => {
        navigate("/d/post-portfolio/");
      },
    },
    {
      label: project.projectName,
      command: () => {
        navigate(`/d/post-portfolio/${project.id}`);
      },
    },
    { label: "Discussion" },
  ];

  return (
    <div className="flex flex-column w-full">
      {/* Breadcrumb */}
      <div className="flex w-full pb-2">
        <BreadCrumb model={breadCrumbItems} />
      </div>
      <div className="flex w-full">
        {/* Section heading */}
        <SectionHeading
          icon="icon icon-common icon-drug"
          heading={project.projectName + " | " + project?.currentStage}
          entryPoint={
            project.targetName ||
            ExtractBaseScreenNameFromScreen(project.screenName) ||
            project.projectName
          }
          displayHorizon={true}
          color={appColors.sectionHeadingBg.postPortfolio}
        />
      </div>
      <div className="flex w-full">
        {/* Discussion component */}
        <Discussion
          reference={project.targetName || project.projectName}
          section={project?.currentStage || "Post-Portfolio"}
        />
      </div>
    </div>
  );
};

export default PostPortfolioDiscussion;
