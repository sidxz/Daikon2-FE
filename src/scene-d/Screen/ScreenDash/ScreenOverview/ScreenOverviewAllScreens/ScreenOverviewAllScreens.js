import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";

const ScreenOverviewAllScreens = () => {
  return (
    <div
      className="flex flex-column surface-50 p-1 align-items-center justify-content-center w-full text-lg  border-1 border-0 gap-2"
      style={{
        color: "#3c83bd",
      }}
    >
      <div className="flex pt-2 pb-1">
        <b>ALL SCREENS</b>
      </div>
      <div className="flex flex-column w-full border-1 ">
        <DataTable>
          <Column
            field="id"
            header="Targets & Phenotypics"
            style={{ backgroundColor: "#42b2da", color: "white" }}
            filter
          />
          <Column
            field="id"
            header="Total Screens"
            style={{ backgroundColor: "#42b2da", color: "white" }}
          />
          <Column
            field="id"
            header="Total Validated Hits"
            style={{ backgroundColor: "#42b2da", color: "white" }}
          />
          <Column
            field="id"
            header="Screening Type"
            style={{ backgroundColor: "#42b2da", color: "white" }}
            filter
          />
          <Column
            field="id"
            header="Organization"
            style={{ backgroundColor: "#42b2da", color: "white" }}
            filter
          />
          <Column
            field="id"
            header="Stage"
            style={{ backgroundColor: "#42b2da", color: "white" }}
            filter
          />
        </DataTable>
      </div>
    </div>
  );
};

export default ScreenOverviewAllScreens;
