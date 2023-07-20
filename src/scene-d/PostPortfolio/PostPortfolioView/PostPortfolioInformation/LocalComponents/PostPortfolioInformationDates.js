import { ContextMenu } from "primereact/contextmenu";
import { Dialog } from "primereact/dialog";
import { Timeline } from "primereact/timeline";
import React, { useRef, useState } from "react";
import EmbeddedHelp from "../../../../../app/common/EmbeddedHelp/EmbeddedHelp";
import FDate from "../../../../../app/common/FDate/FDate";
import FailedLoading from "../../../../../app/common/FailedLoading/FailedLoading";
import PredictedDateEditor from "../../../../../app/common/PredictedDateEditor/PredictedDateEditor";
import StageTag from "../../../../../app/common/StageTag/StageTag";

const PostPortfolioInformationDates = ({ project }) => {
  const cm = useRef(null); // Ref for ContextMenu
  const [displayEditContainer, setDisplayEditContainer] = useState(false); // State for Dialog display
  if (!project) return <FailedLoading />; // If project is not available, show FailedLoading component

  // Array to store timeline events
  let timelineEvents = [];

  // Push Portfolio event to timelineEvents array
  timelineEvents.push({
    stage: "Portfolio",
    date: project.spStart,
    predictedDateNextStage: project.h2LPredictedStart,
  });

  // Push IND event to timelineEvents array if indEnabled is true
  if (project.indEnabled) {
    timelineEvents.push({
      stage: "IND",
      date: project.indStart,
      predictedDateNextStage: project.clinicalP1PredictedStart,
    });

    // Push P1 event to timelineEvents array if status is not "Terminated" and clinicalP1Enabled is false
    if (project.status !== "Terminated" && !project.clinicalP1Enabled) {
      timelineEvents.push({
        stage: "P1",
        date: project.clinicalP1PredictedStart,
        isPredicted: true,
      });
    }
  }

  // Push P1 event to timelineEvents array if clinicalP1Enabled is true
  if (project.clinicalP1Enabled) {
    timelineEvents.push({
      stage: "P1",
      date: project.clinicalP1Start,
    });
  }
  // Push Terminated event to timelineEvents array if status is "Terminated"
  if (project.status === "Terminated") {
    timelineEvents.push({
      stage: "Terminated",
    });
  }

  const contextMenuItems = [
    {
      label: "Edit",
      icon: "pi pi-tablet",
      command: () => setDisplayEditContainer(true),
    },
  ];

  // Function to generate header for the edit dialog
  let headerEditDialog = () => (
    <React.Fragment>
      <i className="icon icon-common icon-database"></i> &nbsp; Editing
      Predicted Start Date
    </React.Fragment>
  );

  // Function to generate date item for each event
  let generateDateItem = (item) => {
    return (
      <div onContextMenu={(e) => item.isPredicted && cm.current.show(e)}>
        <small className="p-text-secondary" style={{ paddingRight: "50px" }}>
          <FDate timestamp={item.date} hideTime={true} />
          {item.isPredicted ? "(*P)" : ""}
        </small>
      </div>
    );
  };

  // Function to customize marker for each event in the timeline
  const customizedMarker = (item) => {
    if (item.isPredicted) {
      return (
        <span>
          <i
            className="icon icon-common icon-dot-circle"
            style={{ color: "#D4E6F1" }}
          ></i>
        </span>
      );
    }
    if (item.stage === project.currentStage) {
      return (
        <span>
          <i
            className="icon icon-common icon-dot-circle"
            style={{ color: "#1F618D" }}
          ></i>
        </span>
      );
    }
    if (item.stage === "Terminated") {
      return (
        <span>
          <i className="pi pi-times-circle" style={{ color: "#1F618D" }}></i>
        </span>
      );
    }
    return (
      <span>
        <i
          className="icon icon-common icon-check-circle"
          style={{ color: "#1F618D" }}
        ></i>
      </span>
    );
  };

  // Function to generate tag for each event
  const tagGenerator = (item) => {
    if (item.isPredicted) {
      return <StageTag stage={"Dotted"} stageName={item.stage} />;
    }
    return <StageTag stage={item.stage} />;
  };

  return (
    <>
      <div style={{ lineHeight: "50%" }}>
        <h2>Timeline</h2>
        <Timeline
          value={timelineEvents}
          layout="horizontal"
          align="top"
          opposite={(item) => tagGenerator(item)}
          content={(item) => generateDateItem(item)}
          style={{ lineHeight: "100%" }}
          marker={customizedMarker}
        />
      </div>
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
          propose a new predicted start date.
        </EmbeddedHelp>
        <PredictedDateEditor
          project={project}
          postSave={() => setDisplayEditContainer(false)}
        />
      </Dialog>
    </>
  );
};

export default PostPortfolioInformationDates;
