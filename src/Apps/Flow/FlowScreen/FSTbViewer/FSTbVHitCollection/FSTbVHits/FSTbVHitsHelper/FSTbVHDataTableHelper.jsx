import { Tag } from "primereact/tag";
import { Tooltip } from "primereact/tooltip";
import React, { useRef } from "react";
import SmilesView from "../../../../../../../Library/SmilesView/SmilesView";
import RelationsTags from "../../../../../../../Shared/TagGenerators/RelationsTags/RelationsTags";

export const RelationsBodyTemplate = (rowData) => {
  const op = useRef(null);
  // check if relations count is more than 0
  if (rowData?.relations?.length > 1) {
    const detailedRelations = <></>;
    // count no of nodeType == "HitCollection" in relations
    const hitCollectionCount = rowData.relations.filter(
      (relation) => relation.nodeType === "HitCollection"
    ).length;
    // check if nodeType= "HitAssessment" is present in relations
    const hitAssessment = rowData.relations.find(
      (relation) => relation.nodeType === "HitAssessment"
    );

    return (
      <div className="flex gap-1">
        <div className="flex">
          <RelationsTags relations={rowData.relations} />
        </div>
        {hitAssessment && (
          <div className="flex">
            <Tag value="HA" icon="pi pi-check" severity="success"></Tag>
          </div>
        )}
        {hitCollectionCount >= 2 && (
          <div className="flex">
            <Tooltip target=".phf" />
            <Tag
              className="phf"
              value="PFH"
              icon="pi pi-exclamation-triangle"
              severity="warning"
              data-pr-tooltip="This compound is found in multiple hit collections. Click Relations to see more details."
            ></Tag>
          </div>
        )}
      </div>
    );
  } else {
    return <></>;
  }
};

export const StructureBodyTemplate = (rowData, subStructureHighlight) => {
  return (
    <>
      <div
        className="flex flex-column"
        style={{ width: "250px", height: "260px" }}
      >
        <div className="flex justify-content-start">
          {RelationsBodyTemplate(rowData)}
        </div>
        <div className="flex w-full h-full">
          <SmilesView
            smiles={rowData?.molecule?.smilesCanonical}
            subStructure={subStructureHighlight}
            compoundId={rowData?.molecule?.id}
            width={250}
            height={250}
          />
        </div>
      </div>
    </>
  );
};

export const LibraryBodyTemplate = (rowData) => {
  return (
    <>
      {rowData.library}
      <br />
      {rowData.source}
    </>
  );
};
