import { formatDistanceToNowStrict } from "date-fns";
import { observer } from "mobx-react-lite";
import React from "react";
import { PiPauseDuotone } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import FDate from "../../../../../Library/FDate/FDate";
import SmilesView from "../../../../../Library/SmilesView/SmilesView";
import TargetFromGraph from "../../../../../Shared/ActiveComponents/TargetFromGraph/TargetFromGraph";
import { AppOrgResolver } from "../../../../../Shared/VariableResolvers/AppOrgResolver";

const FHaDPCard = ({ hitAssessments }) => {
  const { getOrgAliasById } = AppOrgResolver();
  const navigate = useNavigate();

  // calculate the no of days the HA is paused
  const calculatePausedDays = (pausedDate) => {
    return formatDistanceToNowStrict(new Date(pausedDate), { addSuffix: true });
  };

  if (!hitAssessments || hitAssessments.length === 0)
    return (
      <div className="flex justify-content-center w-full align-items-center text-sm text-color-secondary">
        - No HAs are paused. -
      </div>
    );

  return (
    <div className="flex flex-wrap gap-3 justify-content-start p-3">
      {hitAssessments.map((ha) => (
        <div
          key={ha.id}
          className="flex flex-column shadow-1 hover:shadow-3 border-round-md surface-card p-2"
          style={{ width: "400px" }} // Dynamic sizing
        >
          {/* Clickable Section */}
          <div
            className="cursor-pointer"
            onClick={() => navigate(`/wf/ha/viewer/${ha.id}/information`)}
          >
            {/* Header */}
            <div className="surface-200	 text-center border-round-top-md p-2">
              <span className="text-lg text-600 font-bold">{ha.name}</span>
            </div>

            {/* Details */}
            <div className="flex border-bottom-1 border-200">
              <div className="flex-grow-1 p-2 text-600	 border-right-1 border-200">
                <TargetFromGraph elementId={ha.id} />
              </div>
              <div className="flex-grow-1 p-2 text-600	 border-right-1 border-200">
                {getOrgAliasById(ha?.primaryOrgId)}
              </div>
              <div className="flex-grow-1 p-2 text-600">
                <FDate timestamp={ha?.statusLastModifiedDate} />
              </div>
            </div>

            {/* SMILES Image */}
            <div className="flex justify-content-center p-2">
              <SmilesView
                smiles={ha.compoundEvoLatestSMILES}
                width={150}
                height={150}
              />
            </div>
            <div className="flex justify-content-center align-items-center p-2 gap-2">
              <div className="flex">
                <PiPauseDuotone />
              </div>
              <div className="flex text-600">
                Paused {calculatePausedDays(ha?.statusPausedDate)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default observer(FHaDPCard);
