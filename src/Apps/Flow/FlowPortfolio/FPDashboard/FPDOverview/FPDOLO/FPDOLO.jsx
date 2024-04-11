import { observer } from "mobx-react-lite";
import React from "react";
import { useNavigate } from "react-router-dom";
import FDate from "../../../../../../Library/FDate/FDate";
import SmilesView from "../../../../../../Library/SmilesView/SmilesView";
import { AppOrgResolver } from "../../../../../../Shared/VariableResolvers/AppOrgResolver";

const FPDOLO = ({ projects }) => {
  const { getOrgNameById } = AppOrgResolver();
  const navigate = useNavigate();
  // check if projects is empty or not set or null
  if (!projects || projects.length === 0)
    return (
      <div className="flex justify-content-center w-full align-items-center text-sm	text-color-secondary ">
        - No LO projects are available -
      </div>
    );
  let projectsComponent = projects.map((project) => {
    const displayTargetName = project.targetName
      ? project.targetName
      : "Phenotypic";
    return (
      <div className="flex flex-column w-full shadow-1 hover:shadow-3">
        <div
          className="flex flex-column  justify-content-center cursor-pointer "
          onClick={() => {
            navigate(`/wf/portfolio/viewer/${project.id}/information`);
          }}
        >
          <div
            className="flex flex-column justify-content-center "
            style={{
              backgroundColor: "#a38e74",
            }}
          >
            <div className="flex p-2 text-lg text-100 text-white-alpha-90 justify-content-center">
              {project.name}
            </div>
          </div>
          <div className="flex justify-content-center border-bottom-1 border-gray-100">
            <div
              className="flex justify-content-center w-full  p-2 text-yellow-900 border-right-1 border-gray-100"
              style={{
                minWidth: "4rem",
              }}
            >
              rho
            </div>

            <div
              className="flex justify-content-center w-full  p-2 text-yellow-900 border-right-1 border-gray-100"
              style={{
                minWidth: "4rem",
              }}
            >
              {getOrgNameById(project?.primaryOrgId)}
            </div>

            <div
              className="flex justify-content-center w-full p-2 text-yellow-900 border-right-1 border-gray-100"
              style={{
                minWidth: "4rem",
              }}
            >
              <FDate timestamp={project.loStart} color="#52422D" />
            </div>

            <div
              className="flex justify-content-center w-full  p-2 text-pink-800 border-right-1 border-gray-100"
              style={{
                minWidth: "4rem",
                backgroundColor: "#d48e8f",
              }}
            >
              <FDate timestamp={project.spPredictedStart} color="#FFFFFF" />
            </div>
          </div>
          <div className="flex w-full justify-content-center">
            <SmilesView
              smiles={
                project.compoundEvoLatestSMILES != null
                  ? project.compoundEvoLatestSMILES
                  : project.compoundSMILES
              }
              width={220}
              height={220}
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

export default observer(FPDOLO);
