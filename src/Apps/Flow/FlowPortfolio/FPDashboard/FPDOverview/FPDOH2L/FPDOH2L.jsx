import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import FDate from "../../../../../../Library/FDate/FDate";
import SmilesView from "../../../../../../Library/SmilesView/SmilesView";
import { RootStoreContext } from "../../../../../../RootStore";
import TargetFromGraph from "../../../../../../Shared/ActiveComponents/TargetFromGraph/TargetFromGraph";
import { AppOrgResolver } from "../../../../../../Shared/VariableResolvers/AppOrgResolver";

const FPDOH2L = () => {
  const rootStore = useContext(RootStoreContext);
  const { activeH2LProjects } = rootStore.projectStore;

  const { getOrgAliasById } = AppOrgResolver();
  const navigate = useNavigate();
  // check if activeH2LProjects is empty or not set or null
  if (!activeH2LProjects || activeH2LProjects.length === 0)
    return (
      <div className="flex justify-content-center w-full align-items-center text-sm	text-color-secondary ">
        - No H2L projects are available -
      </div>
    );

  let projectsComponent = activeH2LProjects.map((project) => {
    const displayTargetName = project.targetName
      ? project.targetName
      : "Unknown";
    return (
      <div
        className="flex flex-column w-full shadow-1 hover:shadow-3 border-round-md"
        key={project.id}
      >
        <div
          className="flex flex-column  justify-content-center cursor-pointer "
          onClick={() => {
            navigate(`/wf/portfolio/viewer/${project.id}/information`);
          }}
        >
          <div
            className="flex flex-column justify-content-center border-round-top-md "
            style={{
              backgroundColor: "#8c9f8b",
            }}
          >
            <div className="flex p-2 text-lg text-100 text-white-alpha-90 justify-content-center">
              {project.name}
            </div>
          </div>

          <div className="flex justify-content-center border-green-100 border-bottom-1">
            <div
              className="flex justify-content-center align-items-center w-full p-2 text-green-800 border-right-1 border-green-100"
              style={{
                minWidth: "4rem",
                backgroundColor: "#9c8c79",
              }}
            >
              <div className="flex mr-1 text-white">
                <i className="pi pi-angle-double-right" />
              </div>
              <div className="flex">
                <FDate timestamp={project.h2LStart} color="#FFFFFF" />
              </div>
            </div>

            <div
              className="flex justify-content-center w-full p-2 text-green-800 border-right-1 border-green-100"
              style={{
                minWidth: "4rem",
              }}
            >
              {getOrgAliasById(project?.primaryOrgId)}
            </div>

            <div
              className="flex justify-content-center w-full p-2 text-green-800 border-right-1 border-green-100"
              style={{
                minWidth: "4rem",
              }}
            >
              <TargetFromGraph elementId={project.id} />
            </div>

            <div
              className="flex justify-content-center align-items-center w-full p-2 text-100"
              style={{
                minWidth: "4rem",
                backgroundColor: "#6e8a9d",
              }}
            >
              <div className="flex">
                <FDate timestamp={project.loPredictedStart} color="#FFFFFF" />{" "}
              </div>
              <div className="flex ml-1 text-white">
                <i className="pi pi-angle-double-right" />
              </div>
            </div>
          </div>
          <div className="flex w-full p-2 justify-content-center">
            <SmilesView
              smiles={
                project.compoundEvoLatestSMILES != null
                  ? project.compoundEvoLatestSMILES
                  : project.compoundSMILES
              }
              width={200}
              height={200}
            />
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="flex flex-wrap w-full gap-3 p-1 align-items-center justify-content-center w-full">
      {projectsComponent}
    </div>
  );
};

export default observer(FPDOH2L);
