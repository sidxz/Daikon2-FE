import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { appColors } from "../../../../../constants/colors";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import ParsedDocsByTags from "../../../../DocuStore/ParsedDocsByTags/ParsedDocsByTags";
import { HAIcon } from "../../../icons/HAIcon";

const FHaVDocs = ({ selectedHa }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Set initial tags based on selected target
  useEffect(() => {
    if (!searchParams.has("tags")) {
      // Only set the tags if none are present in the URL
      setSearchParams({ tags: selectedHa.name });
    }
  }, [searchParams, setSearchParams, selectedHa.name]);

  const breadCrumbItems = [
    {
      label: "HAs",
      command: () => navigate("/wf/target/"),
    },
    {
      label: selectedHa.name,
      command: () => {
        navigate(`/wf/ha/viewer/${selectedHa.id}`);
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
          svgIcon={<HAIcon size={"25em"} />}
          heading={"Hit Assessment - " + selectedHa.name}
          color={appColors.sectionHeadingBg.ha}
          displayHorizon={true}
          entryPoint={selectedHa?.id}
        />
      </div>
      <div className="flex w-full pt-1">
        {/* ParsedDocsByTags automatically reads tags from the URL */}
        <ParsedDocsByTags />
      </div>
    </div>
  );
};

export default observer(FHaVDocs);
