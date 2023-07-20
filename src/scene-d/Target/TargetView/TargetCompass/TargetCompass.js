import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import { ScrollPanel } from "primereact/scrollpanel";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import RichTextEdit from "../../../../app/common/RichTextEdit/RichTextEdit";
import SectionHeading from "../../../../app/common/SectionHeading/SectionHeading";
import { RootStoreContext } from "../../../../app/stores/rootStore";
import { appColors } from "../../../../colors";
import cssClass from "./TargetCompass.module.css";

const TargetCompass = () => {
  // Get the MobX root store
  const rootStore = useContext(RootStoreContext);
  const {
    target,
    selectedTarget,
    fetchTargetHistory,
    historyDisplayLoading,
    targetHistory,
    editTargetSummary,
    cancelEditTargetSummary,
  } = rootStore.targetStore;
  const { user } = rootStore.userStore;

  // Use the React Router hook for navigation
  const navigate = useNavigate();

  // Define the breadcrumb items
  const breadCrumbItems = [
    {
      label: "Targets",
      command: () => {
        navigate("/d/target/");
      },
    },
    {
      label: selectedTarget.name,
      command: () => {
        navigate(`/d/target/${selectedTarget.id}`);
      },
    },
    { label: "Summary" },
  ];

  return (
    <div className="flex flex-column w-full">
      {/* Breadcrumb */}
      <div className="flex w-full pb-2">
        <BreadCrumb model={breadCrumbItems} />
      </div>

      {/* Section Heading */}
      <div className="flex w-full">
        <SectionHeading
          icon="icon icon-common icon-target"
          heading={selectedTarget.name}
          entryPoint={selectedTarget.name}
          displayHorizon={true}
          color={appColors.sectionHeadingBg.target}
        />
      </div>

      {/* Target Compass Quadrants */}
      <div className="flex w-full">
        <div className={[cssClass.QuadMain].join(" ")}>
          {/* Quadrant 1 - Background */}
          <div className={[cssClass.QuadRow].join(" ")}>
            <div
              className={[cssClass.QuadColumn].join(" ")}
              style={{
                backgroundColor: "#D4F1F4",
                borderRight: "3px solid #FFF",
              }}
            >
              <center>
                <h2 style={{ margin: 0, padding: 0 }}>Background</h2>
                <hr />
              </center>
              <ScrollPanel style={{ width: "100%", height: "250px" }}>
                <RichTextEdit
                  data={target}
                  dataSelector={"background"}
                  fetchHistory={() => fetchTargetHistory()}
                  historyDisplayLoading={historyDisplayLoading}
                  history={targetHistory}
                  editFunc={() => editTargetSummary()}
                  cancelEdit={() => cancelEditTargetSummary()}
                />
              </ScrollPanel>
            </div>

            {/* Quadrant 2 - Enablement */}
            <div
              className={[cssClass.QuadColumn].join(" ")}
              style={{
                backgroundColor: "#DDFFE7",
                borderLeft: "3px solid #FFF",
              }}
            >
              <center>
                <h2 style={{ margin: 0, padding: 0 }}>Enablement</h2>
                <hr />
              </center>
              <ScrollPanel style={{ width: "100%", height: "250px" }}>
                <RichTextEdit
                  data={target}
                  dataSelector={"enablement"}
                  fetchHistory={() => fetchTargetHistory()}
                  historyDisplayLoading={historyDisplayLoading}
                  history={targetHistory}
                  editFunc={() => editTargetSummary()}
                  cancelEdit={() => cancelEditTargetSummary()}
                />
              </ScrollPanel>
            </div>
          </div>

          <div className={[cssClass.QuadRow].join(" ")}>
            {/* Quadrant 3 - Strategy */}
            <div
              className={[cssClass.QuadColumn].join(" ")}
              style={{
                backgroundColor: "#EAE6F0",
                borderTop: "6px solid #FFF",
                borderRight: "3px solid #FFF",
              }}
            >
              <center>
                <h2 style={{ margin: 0, padding: 0 }}>Strategy</h2>
                <hr />
              </center>
              <ScrollPanel style={{ width: "100%", height: "250px" }}>
                <RichTextEdit
                  data={target}
                  dataSelector={"strategy"}
                  fetchHistory={() => fetchTargetHistory()}
                  historyDisplayLoading={historyDisplayLoading}
                  history={targetHistory}
                  editFunc={() => editTargetSummary()}
                  cancelEdit={() => cancelEditTargetSummary()}
                />
              </ScrollPanel>
            </div>
            {/* Quadrant 4 - Challenges */}
            <div
              className={[cssClass.QuadColumn].join(" ")}
              style={{
                backgroundColor: "#FBE5C8",
                borderTop: "6px solid #FFF",
                borderLeft: "3px solid #FFF",
              }}
            >
              <center>
                <h2 style={{ margin: 0, padding: 0 }}>Challenges</h2>
                <hr />
              </center>
              <ScrollPanel style={{ width: "100%", height: "250px" }}>
                <RichTextEdit
                  data={target}
                  dataSelector={"challenges"}
                  fetchHistory={() => fetchTargetHistory()}
                  historyDisplayLoading={historyDisplayLoading}
                  history={targetHistory}
                  editFunc={() => editTargetSummary()}
                  cancelEdit={() => cancelEditTargetSummary()}
                />
              </ScrollPanel>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(TargetCompass);
