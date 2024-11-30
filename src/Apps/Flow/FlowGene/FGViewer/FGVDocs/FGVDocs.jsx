import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { appColors } from "../../../../../constants/colors";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import ParsedDocsByTags from "../../../../DocuStore/ParsedDocsByTags/ParsedDocsByTags";
import { GeneIcon } from "../../../icons/GeneIcon";

const FGVDocs = ({ selectedGene }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Set initial tags based on selected gene
  useEffect(() => {
    const currentTags = searchParams.get("tags") || ""; // Get current tags as a string
    const currentTagsArray = currentTags ? currentTags.split(",") : []; // Convert to array
    const newTagsArray = [selectedGene.accessionNumber, selectedGene.name]; // Merge uniquely
    const newTagsString = newTagsArray.join(","); // Convert back to string

    if (!currentTags) {
      console.log("newTagsString", newTagsString);
      setSearchParams({ tags: newTagsString });
    }
  }, [
    searchParams.toString(),
    setSearchParams,
    selectedGene.accessionNumber,
    selectedGene.name,
  ]);

  console.log("selectedGene", selectedGene);

  const breadCrumbItems = [
    {
      label: "Genes",
      command: () => {
        navigate("/wf/gene/");
      },
    },
    {
      label: selectedGene.accessionNumber,
      command: () => {
        navigate(`/wf/gene/${selectedGene.id}`);
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
          svgIcon={<GeneIcon size={"25em"} />}
          heading={selectedGene.accessionNumber}
          accessionNumber={selectedGene.accessionNumber}
          displayHorizon={true}
          color={appColors.sectionHeadingBg.gene}
          breadCrumbItems={breadCrumbItems}
          entryPoint={selectedGene?.id}
        />
      </div>
      <div className="flex w-full pt-1">
        {/* ParsedDocsByTags automatically reads tags from the URL */}
        <ParsedDocsByTags />
      </div>
    </div>
  );
};

export default observer(FGVDocs);
