import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";
import StageTag from "../../../../../app/common/StageTag/StageTag";
import TagGeneral from "../../../../../app/common/TagGeneral/TagGeneral";
import "./LocalComponents.css";

// Component for displaying general project information
const PortfolioInformationGeneralInformation = ({ project }) => {
  // Create an array of data objects to be displayed in the DataTable
  let data = [
    {
      name: "Id",
      value: project.id,
    },
    {
      name: "Internal Id",
      value: project.projectLegacyId,
    },
    {
      name: "Target",
      value: (
        <div>
          <i className="icon icon-common icon-target" />{" "}
          {project.targetName ? project.targetName : "Unknown"}
        </div>
      ),
    },
    {
      name: "Current Stage",
      value: <StageTag stage={project.currentStage} />,
    },
    {
      name: "Project Status",
      value: <TagGeneral tag={project.status} />,
    },
    {
      name: "H2L Description",
      value: (
        <div
          className="overflow-hidden text-overflow-ellipsis"
          style={{ maxWidth: "400px" }}
        >
          {project.h2LDescription}
        </div>
      ),
    },
  ];

  // Check if LO (Line of Business) is enabled for the project
  if (project.loEnabled) {
    data.push({
      name: "LO Description",
      value: (
        <div
          className="overflow-hidden text-overflow-ellipsis"
          style={{ maxWidth: "400px" }}
        >
          {project.loDescription}
        </div>
      ),
    });
  }

  // Check if SP (Service Provider) is enabled for the project
  if (project.spEnabled) {
    data.push({
      name: "SP Description",
      value: (
        <div
          className="overflow-hidden text-overflow-ellipsis"
          style={{ maxWidth: "400px" }}
        >
          {project.spDescription}
        </div>
      ),
    });
  }

  return (
    <div className="flex flex-column flex-wrap card-container min-w-max">
      {/* Render the DataTable component to display the project information */}
      <DataTable className="noDataTableHeader" value={data}>
        <Column field="name"></Column>
        <Column field="value"></Column>
      </DataTable>
    </div>
  );
};

export default PortfolioInformationGeneralInformation;
