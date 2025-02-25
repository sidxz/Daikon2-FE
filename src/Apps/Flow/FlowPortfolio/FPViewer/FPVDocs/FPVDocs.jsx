import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { appColors } from "../../../../../constants/colors";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import ParsedDocsByTags from "../../../../DocuStore/ParsedDocsByTags/ParsedDocsByTags";
import { PortfolioIcon } from "../../../icons/PortfolioIcon";

const FPVDocs = ({ selectedProject }) => {
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
      label: "Portfolio",
      command: () => navigate("/wf/portfolio/"),
    },
    {
      label: selectedProject.name,
      command: () => {
        navigate(`/wf/portfolio/viewer/${selectedProject.id}`);
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
          svgIcon={<PortfolioIcon size={"25em"} />}
          heading={"Portfolio - " + selectedProject.name}
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

export default observer(FPVDocs);
