import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import { appColors } from "../../../../../constants/colors";
import ParsedDocsByTags from "../../../../DocuStore/ParsedDocsByTags/ParsedDocsByTags";
import { ScreenIcon } from "../../../icons/ScreenIcon";

const FSTbDocs = ({ selectedScreen }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const associatedTargetValues = selectedScreen.associatedTargets
    ? Object.values(selectedScreen.associatedTargets)
    : [];

  // Set initial tags based on selected screen
  useEffect(() => {
    const currentTags = searchParams.get("tags") || ""; // Get current tags as a string
    const currentTagsArray = currentTags ? currentTags.split(",") : []; // Convert to array
    const newTagsArray = [
      ...new Set([
        ...currentTagsArray,
        ...associatedTargetValues,
        selectedScreen.name,
      ]),
    ]; // Merge uniquely
    const newTagsString = newTagsArray.join(","); // Convert back to string

    if (!currentTags) {
      setSearchParams({ tags: newTagsString });
    }
  }, [
    searchParams.toString(),
    setSearchParams,
    associatedTargetValues,
    selectedScreen.name,
  ]);
  console.log("selectedScreen", selectedScreen);

  const breadCrumbItems = [
    {
      label: "Screens",
      command: () => {
        navigate("/wf/screen/dash/");
      },
    },
    {
      label: "Target Based",
      command: () => {
        navigate("/wf/screen/dash/target-based/");
      },
    },
    {
      label: selectedScreen.name,
      command: () => {
        navigate(`/wf/screen/viewer/tb/${selectedScreen.id}`);
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

export default observer(FSTbDocs);
