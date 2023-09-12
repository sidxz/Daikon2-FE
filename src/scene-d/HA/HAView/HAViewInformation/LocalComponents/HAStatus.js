import { Column } from "primereact/column";
import { ContextMenu } from "primereact/contextmenu";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import React, { useRef, useState } from "react";
import EmbeddedHelp from "../../../../../app/common/EmbeddedHelp/EmbeddedHelp";
import FDate from "../../../../../app/common/FDate/FDate";
import PredictedDateEditor from "../../../../../app/common/PredictedDateEditor/PredictedDateEditor";
import TagGeneral from "../../../../../app/common/TagGeneral/TagGeneral";
import HAStatusDropDown from "./HAStatusDropDown";

const HAStatus = ({ project }) => {
  const cm = useRef(null);
  const [displayEditContainer, setDisplayEditContainer] = useState(false);

  const contextMenuItems = [
    {
      label: "Edit",
      icon: "pi pi-tablet",
      command: () => setDisplayEditContainer(true),
    },
  ];

  let headerEditDialog = () => (
    <React.Fragment>
      <i className="icon icon-common icon-database"></i> &nbsp; Editing H2L
      Predicted Start Date
    </React.Fragment>
  );

  let data = [
    {
      name: "HA Status",
      value: (
        <TagGeneral
          tag={
            project.status === "Active"
              ? project.currentStage === "HA"
                ? "Ongoing"
                : "Complete"
              : project.currentStage === "HA"
                ? "Terminated at HA"
                : "Complete"
          }
        />
      ),
    },
    {
      name: "HA Status Change",
      value: <HAStatusDropDown id={project.id}
        status={project?.status} />,

    },
    {
      name: "HA Start Date",
      value: <FDate timestamp={project.haStart} hideTime={true} />,
    },
  ];
  if (project.currentStage === "HA" && project.status === "Active") {
    data.push({
      name: (
        <div onContextMenu={(e) => cm.current.show(e)}>H2L Predicted Start</div>
      ),
      value: (
        <div onContextMenu={(e) => cm.current.show(e)}>
          <FDate timestamp={project.h2LPredictedStart} hideTime={true} />
        </div>
      ),
    });
  }

  return (
    <div className="flex flex-column flex-wrap card-container">
      <DataTable className="noDataTableHeader" value={data}>
        <Column field="name"></Column>
        <Column field="value"></Column>
      </DataTable>
      <ContextMenu model={contextMenuItems} ref={cm}></ContextMenu>
      <Dialog
        header={headerEditDialog}
        visible={displayEditContainer}
        closable={true}
        draggable={true}
        style={{ width: "50vw" }}
        onHide={() => setDisplayEditContainer(false)}
      >
        <EmbeddedHelp>
          Project's primary organization and participating organization can
          propose a new predicted start date for H2L.
        </EmbeddedHelp>
        <PredictedDateEditor
          project={project}
          postSave={() => setDisplayEditContainer(false)}
        />
      </Dialog>
    </div>
  );
};

export default HAStatus;
