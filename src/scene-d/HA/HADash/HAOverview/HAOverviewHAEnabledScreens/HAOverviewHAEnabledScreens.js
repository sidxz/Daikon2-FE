import React from "react";
import { useNavigate } from "react-router-dom";
import FDate from "../../../../../app/common/FDate/FDate";
import SmilesView from "../../../../../app/common/SmilesView/SmilesView";

const HAOverviewHAEnabledScreens = ({ projects }) => {
  const navigate = useNavigate();
  // check if projects is empty or not set or null
  if (!projects || projects.length === 0)
    return (
      <div className="flex justify-content-center align-items-center w-full text-sm	text-color-secondary">
        - No screens are waiting for HA -
      </div>
    );

  let projectsComponent = projects.map((project) => {
    return (
      <div className="flex shadow-1 hover:shadow-3 w-full">
        <div className="flex w-6">
          <SmilesView
            smiles="O=S(C1=CN=C(C2=CC=CC=C2)S1)(NC3=NC=C(Cl)C=C3Cl)=O"
            width={"150"}
            height={"150"}
          />
        </div>
        <div className="flex flex-column w-6 bg-cyan-50 justify-content-center p-1">
          <div
            className="flex flex-column justify-content-center cursor-pointer gap-1"
            style={{
              fontSize: "large",
            }}
            onClick={() => {
              navigate(`/d/ha/${project.id}`);
            }}
          >
            <div
              className="flex m-2 justify-content-center"
              style={{
                minWidth: "7rem",
                color: "#0e7994",
              }}
            >
              {project.projectName}
            </div>
            <div
              className="flex pl-3 text-700 text-sm"
              style={{
                minWidth: "4rem",
              }}
            >
              {project.screenName}
            </div>

            <div
              className="flex pl-3 text-700 text-sm"
              style={{
                minWidth: "4rem",
              }}
            >
              {project.primaryOrg.alias}
            </div>

            <div
              className="flex pl-3 text-700 text-sm"
              style={{
                minWidth: "4rem",
              }}
            >
              <FDate timestamp={project.haStatusDate} color={"#616161"} />
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

export default HAOverviewHAEnabledScreens;
