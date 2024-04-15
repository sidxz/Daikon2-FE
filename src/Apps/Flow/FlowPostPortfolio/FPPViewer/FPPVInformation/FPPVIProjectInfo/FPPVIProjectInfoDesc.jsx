import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";

const FPPVIProjectInfoDesc = () => {
  let projectDescData = [
    {
      name: "IND Description",
      value:
        "Phenotypic project where target is unknown- split when MMV46 reached SP and SAR diverged in March 2023. More text coming.Phenotypic project where target is unknown- split when MMV46 reached SP and SAR diverged in March 2023. More text coming.",
    },
    {
      name: "P1 Description",
      value:
        "Phenotypic project where target is unknown- split when MMV46 reached SP and SAR diverged in March 2023. More text coming.Phenotypic project where target is unknown- split when MMV46 reached SP and SAR diverged in March 2023. More text coming.",
    },
  ];

  return (
    <div className="flex w-full pt-1">
      <DataTable value={projectDescData} className="HideDataTableHeader w-full">
        <Column field="name"></Column>
        <Column field="value"></Column>
      </DataTable>
    </div>
  );
};

export default FPPVIProjectInfoDesc;
