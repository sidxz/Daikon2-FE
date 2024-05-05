import { observer } from "mobx-react-lite";
import React from "react";
import { useNavigate } from "react-router-dom";
import FDate from "../../../../../../Library/FDate/FDate";
import SmilesView from "../../../../../../Library/SmilesView/SmilesView";
import TargetFromGraph from "../../../../../../Shared/ActiveComponents/TargetFromGraph/TargetFromGraph";
import { AppOrgResolver } from "../../../../../../Shared/VariableResolvers/AppOrgResolver";

const FHaDOReadyForHA = ({ hitAssessments }) => {
  const { getOrgAliasById } = AppOrgResolver();
  const navigate = useNavigate();

  if (!hitAssessments || hitAssessments.length === 0)
    return (
      <div className="flex justify-content-center w-full align-items-center text-sm	text-color-secondary">
        - No hits are ready for HAs -
      </div>
    );

  console.log("FHaDOReadyForHA -> hitAssessments", hitAssessments);

  let hitAssessmentsComponent = hitAssessments.map((ha) => {
    return (
      <div className="flex flex-column w-full shadow-1 hover:shadow-3 border-round-md ">
        <div
          className="flex flex-column  justify-content-center cursor-pointer"
          onClick={() => {
            navigate(`/wf/ha/viewer/${ha.id}/information`);
          }}
        >
          <div className="flex flex-column bg-orange-100  justify-content-center border-round-top-md ">
            <div
              className="flex p-2 text-lg text-orange-800 justify-content-center"
              style={{
                minWidth: "7rem",
              }}
            >
              {ha.name}
            </div>
          </div>

          <div className="flex justify-content-center  border-bottom-1 border-orange-100">
            <div
              className="flex justify-content-center w-4 p-2 text-orange-600 border-right-1 border-orange-100"
              style={{
                minWidth: "4rem",
              }}
            >
              <TargetFromGraph elementId={ha.id} />
            </div>

            <div
              className="flex justify-content-center w-4 p-2 text-orange-600 border-right-1 border-orange-100"
              style={{
                minWidth: "4rem",
              }}
            >
              {getOrgAliasById(ha?.primaryOrgId)}
            </div>

            <div
              className="flex justify-content-center w-4 p-2 text-orange-600 border-right-1 border-orange-100"
              style={{
                minWidth: "4rem",
              }}
            >
              <FDate timestamp={ha?.statusLastModifiedDate} color="#CC5500" />
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

export default observer(FHaDOReadyForHA);
