import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { FcRight } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import FDate from "../../../../../../Library/FDate/FDate";
import SmilesView from "../../../../../../Library/SmilesView/SmilesView";
import { RootStoreContext } from "../../../../../../RootStore";
import TargetFromGraph from "../../../../../../Shared/ActiveComponents/TargetFromGraph/TargetFromGraph";
import { AppOrgResolver } from "../../../../../../Shared/VariableResolvers/AppOrgResolver";

const FPPDOP1 = () => {
  const rootStore = useContext(RootStoreContext);
  const { activeP1Projects } = rootStore.projectStore;

  const { getOrgAliasById } = AppOrgResolver();
  const navigate = useNavigate();
  // check if activeP1Projects is empty or not set or null
  if (!activeP1Projects || activeP1Projects.length === 0)
    return (
      <div className="flex justify-content-center w-full align-items-center text-sm	text-color-secondary ">
        - No P1 projects are available -
      </div>
    );
  let projectsComponent = activeP1Projects.map((project) => {
    const displayTargetName = project.targetName
      ? project.targetName
      : "Phenotypic";
    return (
      <div className="flex flex-column w-full shadow-1 hover:shadow-3 border-round-md ">
        <div
          className="flex flex-column  justify-content-center cursor-pointer "
          onClick={() => {
            navigate(`/wf/post-portfolio/viewer/${project.id}/information`);
          }}
        >
          <div
            className="flex flex-column justify-content-center border-round-top-md "
            style={{
              backgroundColor: "#6D86A9",
            }}
          >
            <div className="flex p-2 text-lg text-100 text-white-alpha-90 justify-content-center">
              {project.name}
            </div>
          </div>
          <div className="flex justify-content-center border-bottom-1 border-gray-100">
            <div
              className="flex justify-content-center align-items-center w-full"
              style={{
                minWidth: "4rem",
                backgroundColor: "#6D9CA9",
              }}
            >
              <div className="pr-2 ">
                <FcRight />
              </div>
              <FDate timestamp={project.p1Start} color="#FFFFFF" />
            </div>
            <div
              className="flex justify-content-center w-full p-2 text-blue-900 border-right-1 border-gray-100"
              style={{
                minWidth: "4rem",
              }}
            >
              <TargetFromGraph elementId={project.id} />
            </div>

            <div
              className="flex justify-content-center w-full p-2 text-blue-900 border-right-1 border-gray-100"
              style={{
                minWidth: "4rem",
              }}
            >
              {getOrgAliasById(project?.primaryOrgId)}
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

export default observer(FPPDOP1);
