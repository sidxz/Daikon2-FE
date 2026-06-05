import { observer } from "mobx-react-lite";
import { useContext, useState } from "react";
import { RootStoreContext } from "../../../../../RootStore";

const FTTOIRemovedPanel = ({ onChipClick, selectedTargetId, onDrop, onDragStart }) => {
  const rootStore = useContext(RootStoreContext);
  const { removedTargets, selectedCohort, cohorts, selectedCohortIndex } =
    rootStore.targetNominationStore;

  const [isDragOver, setIsDragOver] = useState(false);

  const isLatest = selectedCohortIndex === cohorts.length - 1;
  const cohortLabel = isLatest ? "Latest" : selectedCohort;

  // Group by pathway
  const byPathway = {};
  removedTargets.forEach((target) => {
    const key = target.pathway || "Other";
    if (!byPathway[key]) byPathway[key] = [];
    byPathway[key].push(target);
  });
  const pathwayKeys = Object.keys(byPathway).sort();

  return (
    <div
      className={`ftoi-removed-panel${isDragOver ? " drag-over" : ""}`}
      onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
      onDragEnter={() => setIsDragOver(true)}
      onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setIsDragOver(false); }}
      onDrop={(e) => { e.preventDefault(); setIsDragOver(false); onDrop(); }}
    >
      <div className="ftoi-removed-panel-header">
        <div>
          <div className="ftoi-panel-title">
            Removed Targets &middot; {cohortLabel}
          </div>
          <div className="ftoi-panel-subtitle">Grouped by pathway</div>
        </div>
      </div>

      <div className="ftoi-removed-panel-body">
        {pathwayKeys.length === 0 ? (
          <div className="ftoi-empty-msg">No targets removed.</div>
        ) : (
          pathwayKeys.map((pathway) => (
            <div key={pathway} className="ftoi-pathway-row">
              <span className="ftoi-pathway-label">{pathway}</span>
              <div className="ftoi-chips-wrap">
                {byPathway[pathway].map((target) => (
                  <span
                    key={target.id}
                    className={`ftoi-chip removed${
                      selectedTargetId === target.id ? " selected" : ""
                    }`}
                    onClick={() => onChipClick(target)}
                    title={target.fullName || "Drag to reinstate"}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.effectAllowed = "move";
                      onDragStart(target);
                    }}
                  >
                    {target.name}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default observer(FTTOIRemovedPanel);
