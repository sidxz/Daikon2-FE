import { observer } from "mobx-react-lite";
import React from "react";
import { useNavigate } from "react-router-dom";
import FDate from "../../../../../../Library/FDate/FDate";
import SmilesView from "../../../../../../Library/SmilesView/SmilesView";
import { AppOrgResolver } from "../../../../../../Shared/VariableResolvers/AppOrgResolver";

const FPDOSP = ({ projects }) => {
  const { getOrgNameById } = AppOrgResolver();
  const navigate = useNavigate();
  // check if projects is empty or not set or null
  if (!projects || projects.length === 0)
    return (
      <div className="flex justify-content-center w-full align-items-center text-sm	text-color-secondary ">
        - No SP projects are available -
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
              backgroundColor: "#d48e8f",
            }}
          >
            <div className="flex p-2 text-lg text-100 text-white-alpha-90 justify-content-center">
              {project.name}
            </div>
          </div>
          <div className="flex justify-content-center border-bottom-1 border-gray-100">
            <div
              className="flex justify-content-center w-full p-2 text-pink-600 border-right-1 border-gray-100"
              style={{
                minWidth: "4rem",
              }}
            >
              rho
            </div>

            <div
              className="flex justify-content-center w-full p-2 text-pink-600 border-right-1 border-gray-100"
              style={{
                minWidth: "4rem",
              }}
            >
              {getOrgNameById(project?.primaryOrgId)}
            </div>

            <div
              className="flex justify-content-center w-full p-2 border-right-1 border-gray-100"
              style={{
                minWidth: "4rem",
              }}
            >
              <FDate timestamp={project.spStart} color="#2d8bad" />
            </div>

            <div
              className="flex justify-content-center w-full p-2 text-100"
              style={{
                minWidth: "4rem",
                backgroundColor: "#53A9A8",
              }}
            >
              <FDate timestamp={project.p1PredictedStart} color="#FFFFFF" />
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

export default observer(FPDOSP);
