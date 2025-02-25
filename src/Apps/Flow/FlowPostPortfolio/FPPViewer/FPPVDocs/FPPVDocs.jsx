import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { appColors } from "../../../../../constants/colors";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import ParsedDocsByTags from "../../../../DocuStore/ParsedDocsByTags/ParsedDocsByTags";
import { PostPortfolioIcon } from "../../../icons/PostPortfolioIcon";

const FPPVDocs = ({ selectedProject }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Set initial tags based on selected project
  useEffect(() => {
    if (!searchParams.has("tags")) {
      // Only set the tags if none are present in the URL
      setSearchParams({ tags: selectedProject.name });
    }
  }, [searchParams, setSearchParams, selectedProject.name]);

  const breadCrumbItems = [
    {
      label: "Post Portfolios",
      command: () => {
        navigate("/wf/post-portfolio/");
      },
    },
    {
      label: selectedProject.name,
      command: () => {
        navigate(`/wf/post-portfolio/viewer/${selectedProject.id}`);
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
          svgIcon={<PostPortfolioIcon size={"25em"} />}
          heading={"Post Portfolio - " + selectedProject.name}
          displayHorizon={true}
          color={appColors.sectionHeadingBg.project}
          entryPoint={selectedProject?.id}
        />
      </div>
      <div className="flex w-full pt-1">
        {/* ParsedDocsByTags automatically reads tags from the URL */}
        <ParsedDocsByTags />
      </div>
    </div>
  );
};

export default observer(FPPVDocs);
