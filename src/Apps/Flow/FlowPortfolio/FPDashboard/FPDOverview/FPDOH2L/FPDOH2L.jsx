import React from "react";
import { useNavigate } from "react-router-dom";
import FDate from "../../../../../../Library/FDate/FDate";
import SmilesView from "../../../../../../Library/SmilesView/SmilesView";
import { AppOrgResolver } from "../../../../../../Shared/VariableResolvers/AppOrgResolver";

const FPDOH2L = ({ projects }) => {
  const { getOrgNameById } = AppOrgResolver();
  const navigate = useNavigate();
  // check if projects is empty or not set or null
  if (!projects || projects.length === 0)
    return (
      <div className="flex justify-content-center w-full align-items-center text-sm	text-color-secondary ">
        - No H2L projects are available -
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
          <div className="flex flex-column bg-pink-100  justify-content-center ">
            <div className="flex p-2 text-lg text-pink-800 justify-content-center">
              {project.name}
            </div>
          </div>
          <div className="flex ">
            <div className="flex flex-column justify-content-center  border-pink-100">
              <div
                className="flex justify-content-center w-full p-2 text-pink-600 border-right-1 border-pink-100"
                style={{
                  minWidth: "5rem",
                }}
              >
                {displayTargetName}
              </div>

              <div
                className="flex flex-column justify-content-center w-full p-2 text-pink-600 border-right-1 border-pink-100"
                style={{
                  minWidth: "5rem",
                }}
              >
                {getOrgNameById(project?.primaryOrgId)}
              </div>

              <div
                className="flex flex-column justify-content-center w-full p-2 text-pink-600 border-right-1 border-pink-100"
                style={{
                  minWidth: "5rem",
                }}
              >
                <FDate timestamp={project.dateCreated} color="#b44761" />
              </div>
              <div
                className="flex flex-column justify-content-center w-full p-2 text-pink-600 border-right-1 border-pink-100"
                style={{
                  minWidth: "5rem",
                }}
              >
                <FDate
                  timestamp={project.projectPredictedStart}
                  color="#b44761"
                />
              </div>
            </div>
            <div className="flex w-full justify-content-center">
              <SmilesView smiles={project.smiles} width={100} height={100} />
            </div>
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

export default FPDOH2L;
