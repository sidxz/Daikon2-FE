import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";

const FPVIProjectInfoDesc = () => {
  let projectDescData = [
    {
      name: "H2L Description",
      value:
        "Phenotypic project where target is unknown- split when MMV46 reached SP and SAR diverged in March 2023. More text coming.Phenotypic project where target is unknown- split when MMV46 reached SP and SAR diverged in March 2023. More text coming.",
    },
    {
      name: "LO Description",
      value:
        "Phenotypic project where target is unknown- split when MMV46 reached SP and SAR diverged in March 2023. More text coming.Phenotypic project where target is unknown- split when MMV46 reached SP and SAR diverged in March 2023. More text coming.",
    },
    {
      name: "SP Description",
      value:
        "Phenotypic project where target is unknown- split when MMV46 reached SP and SAR diverged in March 2023",
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

export default FPVIProjectInfoDesc;
