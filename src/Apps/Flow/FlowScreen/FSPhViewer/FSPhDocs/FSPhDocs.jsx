import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { appColors } from "../../../../../constants/colors";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import ParsedDocsByTags from "../../../../DocuStore/ParsedDocsByTags/ParsedDocsByTags";
import { ScreenIcon } from "../../../icons/ScreenIcon";

const FSPhDocs = ({ selectedScreen }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Set initial tags based on selected screen
  useEffect(() => {
    if (!searchParams.has("tags")) {
      // Only set the tags if none are present in the URL
      setSearchParams({ tags: selectedScreen.name });
    }
  }, [searchParams, setSearchParams, selectedScreen.name]);

  console.log("selectedScreen", selectedScreen);

  const breadCrumbItems = [
    {
      label: "Screens",
      command: () => {
        navigate("/wf/screen/dash/");
      },
    },
    {
      label: "Phenotypic",
      command: () => {
        navigate("/wf/screen/dash/phenotypic/");
      },
    },
    {
      label: selectedScreen.name,
      command: () => {
        navigate(`/wf/screen/viewer/ph/${selectedScreen.id}`);
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
          svgIcon={<ScreenIcon size={"25em"} />}
          heading={"Screen - " + selectedScreen.name}
          color={appColors.sectionHeadingBg.screen}
          displayHorizon={true}
          entryPoint={selectedScreen?.id}
        />
      </div>
      <div className="flex w-full pt-1">
        {/* ParsedDocsByTags automatically reads tags from the URL */}
        <ParsedDocsByTags />
      </div>
    </div>
  );
};

export default observer(FSPhDocs);
