import { observer } from "mobx-react-lite";
import React from "react";
import { useNavigate } from "react-router-dom";
import FDate from "../../../../../../Library/FDate/FDate";
import SmilesView from "../../../../../../Library/SmilesView/SmilesView";
import { AppOrgResolver } from "../../../../../../Shared/VariableResolvers/AppOrgResolver";

const FHaDOActiveHA = ({ hitAssessments }) => {
  const { getOrgNameById } = AppOrgResolver();
  const navigate = useNavigate();

  if (!hitAssessments || hitAssessments.length === 0)
    return (
      <div className="flex justify-content-center w-full align-items-center text-sm	text-color-secondary">
        - No HAs are active -
      </div>
    );
  let hitAssessmentsComponent = hitAssessments.map((ha) => {
    return (
      <div className="flex flex-column w-full shadow-1 hover:shadow-3">
        <div
          className="flex flex-column  justify-content-center cursor-pointer"
          onClick={() => {
            navigate(`/wf/ha/viewer/${ha.id}/information`);
          }}
        >
          <div className="flex flex-column bg-blue-100 justify-content-center">
            <div
              className="flex p-2 text-lg text-blue-800 justify-content-center"
              style={{
                minWidth: "7rem",
              }}
            >
              {ha.name}
            </div>
          </div>

          <div className="flex justify-content-center  border-bottom-1 border-blue-100">
            <div
              className="flex justify-content-center w-4 p-2 text-blue-600 border-right-1 border-blue-100"
              style={{
                minWidth: "4rem",
              }}
            >
              rho
            </div>

            <div
              className="flex justify-content-center w-4 p-2 text-blue-600 border-right-1 border-blue-100"
              style={{
                minWidth: "4rem",
              }}
            >
              {getOrgNameById(ha?.primaryOrgId)}
            </div>

            <div
              className="flex justify-content-center w-4 p-2 text-blue-600 border-right-1 border-blue-100"
              style={{
                minWidth: "4rem",
              }}
            >
              <FDate timestamp={ha?.statusLastModifiedDate} color="#1c80cf" />
            </div>
          </div>
          <div className="flex w-full justify-content-center">
            <SmilesView
              smiles={ha.compoundEvoLatestSMILES}
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
      {hitAssessmentsComponent}
    </div>
  );
};

export default observer(FHaDOActiveHA);
