import { observer } from "mobx-react-lite";
import React from "react";
import { useNavigate } from "react-router-dom";
import FDate from "../../../../../../Library/FDate/FDate";
import SmilesView from "../../../../../../Library/SmilesView/SmilesView";
import { AppOrgResolver } from "../../../../../../Shared/VariableResolvers/AppOrgResolver";

const FHaDOInActiveHA = ({ hitAssessments }) => {
  const { getOrgNameById } = AppOrgResolver();
  const navigate = useNavigate();

  if (!hitAssessments || hitAssessments.length === 0)
    return (
      <div className="flex justify-content-center w-full align-items-center text-sm	text-color-secondary">
        - No HAs are inactive -
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
          <div className="flex flex-column bg-yellow-100  justify-content-center">
            <div
              className="flex p-2 text-lg text-yellow-800 justify-content-center"
              style={{
                minWidth: "7rem",
              }}
            >
              {ha.name}
            </div>
          </div>

          <div className="flex justify-content-center  border-bottom-1 border-yellow-100">
            <div
              className="flex justify-content-center w-5 p-2 text-yellow-600 border-right-1 border-yellow-100"
              style={{
                minWidth: "4rem",
              }}
            >
              rho
            </div>

            <div
              className="flex justify-content-center w-5 p-2 text-yellow-600 border-right-1 border-yellow-100"
              style={{
                minWidth: "4rem",
              }}
            >
              {getOrgNameById(ha?.primaryOrgId)}
            </div>

            <div
              className="flex justify-content-center w-5 p-2 text-yellow-600 border-right-1 border-yellow-100"
              style={{
                minWidth: "4rem",
              }}
            >
              <FDate timestamp={new Date().getTime()} color="#d5a326" />
            </div>
          </div>
          <div className="flex w-full justify-content-center">
            <SmilesView smiles={ha.smiles} width={180} height={180} />
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

export default observer(FHaDOInActiveHA);
