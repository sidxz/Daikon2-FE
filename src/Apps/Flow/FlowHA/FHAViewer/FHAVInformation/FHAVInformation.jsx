import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Fieldset } from "primereact/fieldset";
import { Timeline } from "primereact/timeline";
import React from "react";
import { useNavigate } from "react-router";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";

import { Divider } from "primereact/divider";
import SmilesView from "../../../../../Library/SmilesView/SmilesView";
import { appColors } from "../../../../../constants/colors";
import { HAIcon } from "../../../icons/HAIcon";

const FHAVInformation = ({ selectedHA }) => {
  console.log("FHAVInformation -> selectedHA", selectedHA);
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
        navigate(`/wf/ha/viewer/${selectedHA.name}`);
      },
    },
    { label: "Information" },
  ];

  let haInformation = [
    { name: "HA Status", value: selectedHA.haStatus },
    { name: "HA Start Date", value: selectedHA.haStart },
    { name: "H2L Predicted Start Date", value: selectedHA.haPredictedStart },
    { name: "HA Description", value: selectedHA.haDescription },
  ];

  let projectInformation = [
    { name: "Target", value: "Rho" },
    { name: "Participating Org", value: selectedHA.primaryOrg },
    { name: "Supporting Org", value: selectedHA.supportingOrgs },
  ];

  const customizedContent = (item) => {
    return (
      <div className="flex flex-column">
        <div className="flex">
          <SmilesView compound="C1=CC=C(C=C1)C(=O)O" width={300} height={300} />
        </div>

        <div
          className="flex"
          style={{
            lineHeight: "1.5rem",
            marginRight: "50px",
            minWidth: "150px",
          }}
        >
          Ext Id : "SACC-0443305" <br />
          Mol Weight : "100.56" <br />
          Mol Area : "32.67" <br />
          IC50 : "83.53" <br />
          MIC : {item.mic} (&micro;M)
          <br />
        </div>
        <div className="flex flex-column">
          <Divider align="left">
            <div className="flex">
              <i className="pi pi-info-circle mr-2"></i>
              <b>Notes</b>
            </div>
          </Divider>
          {item.notes}
        </div>
      </div>
    );
  };

  const events = [
    {
      // status: structureBody,
      date: "15/10/2020 10:30",
      icon: "pi pi-shopping-cart",
      color: "#9C27B0",
      image: "game-controller.jpg",
    },
    {
      // status: structureBody,
      date: "15/10/2020 14:00",
      icon: "pi pi-cog",
      color: "#673AB7",
    },
    {
      // status: structureBody,
      date: "15/10/2020 16:15",
      icon: "pi pi-shopping-cart",
      color: "#FF9800",
    },
  ];

  const customizedMarker = (item) => {
    return (
      <span
        className="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1"
        style={{ backgroundColor: item.color }}
      >
        <i className={item.icon}></i>
      </span>
    );
  };

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

          <div className="flex pt-2">
            {/* <Fieldset className="m-0 flex-grow-1" legend="Base Hits">
              <DataTable value={baseHits} className="HideDataTableHeader">
                <Column field="name"></Column>
                <Column field="value"></Column>
              </DataTable>
            </Fieldset> */}
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
      <div className="flex w-full">
        <Fieldset className="m-0 flex-grow-1" legend="Compound Evolution">
          <Timeline
            value={events}
            layout="horizontal"
            className="customized-timeline"
            marker={customizedMarker}
            content={customizedContent}
          />
        </Fieldset>
      </div>
    </div>
  );
};

export default observer(FHAVInformation);
