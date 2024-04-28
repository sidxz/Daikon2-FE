import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import React, { useContext, useEffect, useState } from "react";
import PleaseWait from "../../../../../Library/PleaseWait/PleaseWait";
import { RootStoreContext } from "../../../../../RootStore";

const FPPDAddNew = ({ closeSideBar }) => {
  const rootStore = useContext(RootStoreContext);

  const {
    isUpdatingProject,
    updateProject,
    projectList,
    isProjectListCacheValid,
    isFetchingProjects,
  } = rootStore.projectStore;

  const [projectToPromote, setProjectToPromote] = useState(null);

  useEffect(() => {
    if (!isProjectListCacheValid) {
      fetchProjects();
    }
  }, [isProjectListCacheValid]);

  const availableProjects = projectList.filter(
    (projects) => projects.stage === "SP" && projects.isProjectRemoved === false
  );

  if (isFetchingProjects) {
    return <PleaseWait />;
  }

  let onPromote = () => {
    let projectToSubmit = { ...projectToPromote };
    projectToSubmit.stage = "IND";
    console.log("Project to Promote", projectToSubmit);
    updateProject(projectToSubmit).then(() => {
      closeSideBar();
    });
  };

  return (
    <div className="card w-full">
      <div className="field p-fluid">
        <label htmlFor="project">Select Project</label>
        <Dropdown
          id="project"
          value={projectToPromote}
          options={availableProjects}
          onChange={(e) => {
            setProjectToPromote(e.value);
          }}
          placeholder="Select Project"
          optionLabel="name"
          autoFocus
          className="text-base text-color surface-overlay"
        />
      </div>

      <Button
        icon="icon icon-common icon-database-submit"
        label="Create Post Portfolio Project"
        className="p-mt-2"
        onClick={onPromote}
        loading={isUpdatingProject}
      />
    </div>
  );
};

export default observer(FPPDAddNew);
