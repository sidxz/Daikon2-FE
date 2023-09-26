import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import React, { useContext, useState } from "react";
import { RootStoreContext } from "../../../../../app/stores/rootStore";

const ProjectSettingsMarkDelete = ({ project }) => {
  const rootStore = useContext(RootStoreContext);
  const { isDeletingProject, markDeleteProject } = rootStore.projectStore;

  const [visibleTerminationDialog, setVisibleTerminationDialog] =
    useState(false);
  const [delTextValue, setDelTextValue] = useState("");
  const [activateDeleteButton, setActivateDeleteButton] = useState(false);

  if (project.isDeleted) {
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
        The project is deleted
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
    setDelTextValue(val);
    if (val === project.projectName) {
      setActivateDeleteButton(true);
    } else {
      setActivateDeleteButton(false);
    }
  };

  return (
    <div>
      <div className="flex border-1 border-orange-600 border-round">
        <div className="flex flex-column gap-2 p-2">
          <div className="flex">
            <b>Delete Project</b>
          </div>
          <div className="flex">
            <Tag severity="danger" value="Danger"></Tag>
          </div>
          <div className="flex">
            Marking this project as deleted will remove it from the projects
            list.
          </div>
          <div className="flex text-red-500	">This action cannot be undone.</div>
          <div className="flex">
            <Button
              label="DELETE"
              icon="icon icon-common icon-close"
              className="p-button-outlined p-button-danger"
              onClick={() => {
                setDelTextValue("");
                setVisibleTerminationDialog(true);
              }}
            />
          </div>
        </div>
      </div>

      <Dialog
        visible={visibleTerminationDialog}
        style={{ width: "700px" }}
        onHide={() => setVisibleTerminationDialog(false)}
        header="Project Termination"
      >
        <div className="text-red-500">
          Type '<b>{project.projectName}</b>' in the text box and click 'Delete'
          to DELETE the project. This action cannot be undone.
        </div>
        <br />
        <br />
        <div className="formgroup">
          <div className="field w-full">
            <InputText
              className="w-full"
              value={delTextValue}
              onChange={(e) => checkTermText(e.target.value)}
            />
          </div>
          <div className="field">
            <Button
              label="DELETE"
              className="p-button-outlined p-button-danger"
              disabled={!activateDeleteButton}
              loading={isDeletingProject}
              icon="icon icon-common icon-close"
              onClick={() => markDeleteProject(project)}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default observer(ProjectSettingsMarkDelete);
