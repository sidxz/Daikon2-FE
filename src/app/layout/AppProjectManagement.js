import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import ProjectCreate from "../../scene-pm/Projects/ProjectCreate/ProjectCreate";
import ProjectView from "../../scene-pm/Projects/ProjectView/ProjectView";
import Projects from "../../scene-pm/Projects/ProjectsList/Projects";
import Unauthorized from "../common/Unauthorized/Unauthorized";
import { RootStoreContext } from "../stores/rootStore";
import MenuBarPM from "./MenuBar-PM/MenuBarPM";

const AppDefault = () => {
  const rootStore = useContext(RootStoreContext);
  const { user } = rootStore.userStore;

  if (user.roles.includes("projectManager")) {
    return (
      <div className="flex flex-column">
        <div className="block mb-2">
          <MenuBarPM />
        </div>
        <div className="flex ml-3 mr-3 fadein animation-duration-1000">
          <Routes>
            <Route index element={<ProjectView />} />
            {/* Projects Route */}
            <Route path={"project/"} element={<Projects />} />
            <Route path={"project/new/"} element={<ProjectCreate />} />
            <Route path={"project/:id/*"} element={<ProjectView />} />
          </Routes>
        </div>
      </div>
    );
  }

  return (
    <div className="flex m-7 p-7">
      <Unauthorized />
    </div>
  );
};

export default observer(AppDefault);
