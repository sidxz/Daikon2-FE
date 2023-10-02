import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import React, { useContext, useState } from "react";
import { RootStoreContext } from "../../../../../app/stores/rootStore";

const ProjectSettingsRestore = ({ project }) => {
  const rootStore = useContext(RootStoreContext);
  const { isRestoringProject, restoreProject } = rootStore.projectStore;

  const [visibleRestoreDialog, setVisibleRestoreDialog] = useState(false);
  const [restoreTextValue, setRestoreTextValue] = useState("");
  const [activateRestoreButton, setActivateRestoreButton] = useState(false);

  if (project.status === "Active") {
    return (
      <div
        style={{
          borderRadius: "5px",
          borderColor: "#B7950B",
          borderStyle: "solid",
          padding: "20px",
          borderWidth: "1px",
        }}
      >
        The project is Active
      </div>
    );
  }

  if (project.status === "Complete") {
    return (
      <div
        style={{
          borderRadius: "5px",
          borderColor: "#B7950B",
          borderStyle: "solid",
          padding: "20px",
          borderWidth: "1px",
        }}
      >
        The project is complete and has reached it's end of life cycle.
      </div>
    );
  }

  var checkTermText = (val) => {
    setRestoreTextValue(val);
    if (val === project.projectName) {
      setActivateRestoreButton(true);
    } else {
      setActivateRestoreButton(false);
    }
  };

  return (
    <div>
      <div className="flex border-1 border-blue-600 border-round">
        <div className="flex flex-column gap-2 p-2">
          <div className="flex">
            <b>Restore Project</b>
          </div>
          <div className="flex">
            Restore the project to the Active state. This will allow the project
            to be modified and updated.
          </div>
          <div className="flex">
            <Button
              label="Restore"
              icon="icon icon-common icon-envelope-open"
              className="p-button-outlined"
              onClick={() => {
                setRestoreTextValue("");
                setVisibleRestoreDialog(true);
              }}
            />
          </div>
        </div>
      </div>
      <Dialog
        visible={visibleRestoreDialog}
        style={{ width: "700px" }}
        onHide={() => setVisibleRestoreDialog(false)}
        header="Restore Project"
      >
        Type '<b>{project.projectName}</b>' in the text box and click 'Restore'
        to restore the project.
        <br />
        <br />
        <div className="formgroup">
          <div className="field w-full">
            <InputText
              className="w-full"
              value={restoreTextValue}
              onChange={(e) => checkTermText(e.target.value)}
            />
          </div>
          <div className="field">
            <Button
              label="Restore"
              className="p-button-outlined p-button-primary"
              disabled={!activateRestoreButton}
              loading={isRestoringProject}
              icon="icon icon-common icon-envelope-open"
              onClick={() => restoreProject(project)}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default observer(ProjectSettingsRestore);
