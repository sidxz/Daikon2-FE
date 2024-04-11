import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";

const FPVIProjectInfoDesc = () => {
  let h2lDescData = [
    {
      name: "H2L Description",
      value:
        "Phenotypic project where target is unknown- split when MMV46 reached SP and SAR diverged in March 2023",
    },
  ];

  let loDescData = [
    {
      name: "LO Description",
      value:
        "Phenotypic project where target is unknown- split when MMV46 reached SP and SAR diverged in March 2023",
    },
  ];

  let spDescData = [
    {
      name: "SP Description",
      value:
        "Phenotypic project where target is unknown- split when MMV46 reached SP and SAR diverged in March 2023",
    },
  ];

  return (
    <div className="flex flex-column pt-1">
      <DataTable value={h2lDescData} className="HideDataTableHeader">
        <Column field="name"></Column>
        <Column field="value"></Column>
      </DataTable>
      <div className="flex pt-1">
        <DataTable value={loDescData} className="HideDataTableHeader">
          <Column field="name"></Column>
          <Column field="value"></Column>
        </DataTable>
      </div>
      <div className="flex pt-1">
        <DataTable value={spDescData} className="HideDataTableHeader">
          <Column field="name"></Column>
          <Column field="value"></Column>
        </DataTable>
      </div>
    </div>
  );
};

export default FPVIProjectInfoDesc;
