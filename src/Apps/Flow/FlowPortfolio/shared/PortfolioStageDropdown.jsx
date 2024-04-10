import { observer } from "mobx-react-lite";
import { BlockUI } from "primereact/blockui";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
import React, { useContext, useState } from "react";
import { FcExpired } from "react-icons/fc";
import { RootStoreContext } from "../../../../RootStore";
import { stagePortfolioOptions } from "../constants/stageOptions";

const PortfolioStageDropdown = ({ readOnlyStage, readOnly = false }) => {
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);

  const rootStore = useContext(RootStoreContext);

  const { selectedProject, isUpdatingProject, updateProject } =
    rootStore.projectStore;

  // The set of available options for the stage of a project
  if (!selectedProject) {
    return <> </>;
  }

  const stages = stagePortfolioOptions;

  // Template for rendering a selected stage option
  const optionTemplate = (option) => {
    if (option) {
      return (
        <div className="flex align-items-center align-self-center gap-2">
          <div className="flex flex-column">{option.icon}</div>
          <div className="flex flex-column">{option.name}</div>
        </div>
      );
    }
  };
  const valueTemplate = (option) => {
    if (option === null) {
      return (
        <div className="flex align-items-center align-self-center gap-2">
          <div className="flex flex-column">
            <FcExpired />
          </div>
          <div className="flex flex-column">Stage Not Set</div>
        </div>
      );
    }
    if (option) {
      return (
        <div className="flex align-items-center align-self-center gap-2">
          <div className="flex flex-column">{option.icon}</div>
          <div className="flex flex-column">{option.name}</div>
        </div>
      );
    }
  };

  // Event handler for updating the selected stage
  // and making the confirm dialog visible
  const handleStageChange = (e) => {
    console.log(e);
    setSelectedStage(e.value);
    setConfirmDialogVisible(true);
  };

  const updateSelectedStage = () => {
    if (selectedStage) {
      const updatedProject = { ...selectedProject, stage: selectedStage };
      updateProject(updatedProject);
    }
  };

  // Render the component based on readOnly flag
  // Temporarily handle new stage as NA
  if (readOnly) {
    if (readOnlyStage === null) {
      return (
        <div className="flex align-items-center align-self-center gap-2">
          <div className="flex flex-column">
            <FcExpired />
          </div>
          <div className="flex flex-column">Stage Not Set</div>
        </div>
      );
    }
    return (
      <div className="flex align-items-center gap-2 bg-white p-2 m-0">
        <div className="flex flex-column">
          {stages.find((option) => option.value === readOnlyStage)?.icon}
        </div>
        <div className="flex flex-column">
          {readOnlyStage ? readOnlyStage : "Not Available"}
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <BlockUI blocked={isUpdatingProject}>
        <Dropdown
          value={selectedProject.stage}
          options={stages}
          optionLabel="name"
          optionValue="value"
          placeholder="Set Stage"
          itemTemplate={optionTemplate}
          valueTemplate={valueTemplate}
          disabled={isUpdatingProject}
          onChange={handleStageChange}
          pt={{
            root: { style: { border: "0px", borderRadius: "5rem" } },
            input: { style: { paddingRight: "0px" } },
          }}
        />
      </BlockUI>
      <ConfirmDialog
        visible={confirmDialogVisible}
        onHide={() => setConfirmDialogVisible(false)}
        message={`Are you sure you want to change the stage to ${selectedStage}?`}
        header={`HA Stage Change Confirmation | ${selectedStage}`}
        icon="icon icon-common icon-file-signature"
        accept={() => updateSelectedStage()}
        reject={() => setConfirmDialogVisible(false)}
      />
    </div>
  );
};

export default observer(PortfolioStageDropdown);
