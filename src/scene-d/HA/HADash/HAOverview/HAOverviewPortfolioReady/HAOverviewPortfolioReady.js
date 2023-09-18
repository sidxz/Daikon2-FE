import React from "react";
import { useNavigate } from "react-router-dom";
import FDate from "../../../../../app/common/FDate/FDate";
import SmilesView from "../../../../../app/common/SmilesView/SmilesView";

const HAOverviewPortfolioReady = ({ projects }) => {
  const navigate = useNavigate();
  // check if projects is empty or not set or null
  if (!projects || projects.length === 0)
    return (
      <div className="flex justify-content-center align-items-center w-full text-sm	text-color-secondary">
        - No HAs ready for Portfolio -
      </div>
    );

  let projectsComponent = projects.map((project) => {
    return (

      <div className="flex flex-column w-full shadow-1 hover:shadow-3">
        <div
          className="flex flex-column  justify-content-center cursor-pointer"
          onClick={() => {
            navigate(`/d/ha/${project.id}`);
          }}
        >
          <div className="flex flex-column bg-green-100  justify-content-center">
            <div
              className="flex p-2 text-lg text-green-800 justify-content-center"
              style={{
                minWidth: "7rem",
              }}
            >
              {project.projectName}
            </div>
          </div>

          <div className="flex justify-content-center  border-bottom-1 border-green-100">
            <div
              className="flex justify-content-center w-4 p-2 text-green-600 border-right-1 border-green-100"
              style={{
                minWidth: "4rem",
              }}
            >
              {project.screenName}
            </div>

            <div
              className="flex justify-content-center w-4 p-2 text-green-600 border-right-1 border-green-100"
              style={{
                minWidth: "4rem",
              }}
            >
              {project.primaryOrg.alias}
            </div>

            <div
              className="flex justify-content-center w-4 p-2 text-green-600 border-right-1 border-green-100"
              style={{
                minWidth: "4rem",
              }}
            >
              <FDate timestamp={project.haStatusDate} color="#008000" />
            </div>

          </div>
          <div className="flex w-full justify-content-center">
            <SmilesView
              smiles={project?.latestStructure?.smile}
              width={"180"}
              height={"180"}
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

export default HAOverviewPortfolioReady;
