import { BreadCrumb } from "primereact/breadcrumb";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Fieldset } from "primereact/fieldset";
import React from "react";
import { useNavigate } from "react-router";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import { appColors } from "../../../../../constants/colors";
import { HAIcon } from "../../../icons/HAIcon";

const FHAVInformation = (selectedHA) => {
  const navigate = useNavigate();
  const breadCrumbItems = [
    {
      label: "HAs",
      command: () => {
        navigate("/wf/ha/");
      },
    },
    {
      label: selectedHA.name,
      command: () => {
        navigate(`/wf/ha/${selectedHA.name}`);
      },
    },
    { label: "Information" },
  ];

  let haInformation = [
    { name: "HA Status", value: selectedHA.haStatus },
    { name: "HA Start Date", value: selectedHA.haStart },
    { name: "H2L Predicted Start", value: selectedHA.haPredictedStart },
    { name: "HA Description", value: selectedHA.haDescription },
  ];

  let projectInformation = [
    { name: "Internal Project ID", value: selectedHA.legacyId },
    // { name: "Target", value: selectedHA.target},
    { name: "Project Status", value: selectedHA.haStatus },
  ];

  return (
    <div className="flex flex-column w-full">
      <div className="flex w-full">
        <BreadCrumb model={breadCrumbItems} />
      </div>
      <div className="flex w-full">
        <SecHeading
          svgIcon={<HAIcon size={"25em"} />}
          heading={selectedHA.name}
          displayHorizon={true}
          color={appColors.sectionHeadingBg.ha}
          breadCrumbItems={breadCrumbItems}
        />
      </div>
      <div className="flex gap-2">
        <div className="flex flex-column gap-2">
          <div className="flex pt-2">
            <Fieldset className="m-0 flex-grow-1" legend="HA Information">
              <DataTable value={haInformation} className="HideDataTableHeader">
                <Column field="name"></Column>
                <Column field="value"></Column>
              </DataTable>
            </Fieldset>
          </div>
        </div>

        <div className="flex flex-column gap-2">
          <div className="flex pt-2">
            <Fieldset className="m-0 flex-grow-1" legend="Project Information">
              <DataTable
                value={projectInformation}
                className="HideDataTableHeader"
              >
                <Column field="name"></Column>
                <Column field="value"></Column>
              </DataTable>
            </Fieldset>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FHAVInformation;
