import { observer } from "mobx-react-lite";
import { useContext, useState } from "react";
import { RootStoreContext } from "../../../../../RootStore";

const FTTOIActivePanel = ({ onChipClick, selectedTargetId, onDragStart, onDrop }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const rootStore = useContext(RootStoreContext);
  const { activeTargets, selectedCohort, cohorts, selectedCohortIndex } =
    rootStore.targetNominationStore;

  const isLatest = selectedCohortIndex === cohorts.length - 1;
  const cohortLabel = isLatest ? "Latest" : selectedCohort;

  // Group by pathway
  const byPathway = {};
  activeTargets.forEach((target) => {
    const key = target.pathway || "Other";
    if (!byPathway[key]) byPathway[key] = [];
    byPathway[key].push(target);
  });
  const pathwayKeys = Object.keys(byPathway).sort();

  return (
    <div
      className={`ftoi-active-panel${isDragOver ? " drag-over" : ""}`}
      onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
      onDragEnter={() => setIsDragOver(true)}
      onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setIsDragOver(false); }}
      onDrop={(e) => { e.preventDefault(); setIsDragOver(false); onDrop(); }}
    >
      <div className="ftoi-active-panel-header">
        <div>
          <div className="ftoi-panel-title">
            Targets of Interest &middot; {cohortLabel}
          </div>
          <div className="ftoi-panel-subtitle">Grouped by pathway</div>
        </div>
        <div className="ftoi-legend">
          <span className="ftoi-legend-item">
            <span className="ftoi-legend-dot retained" />
            Retained
          </span>
          <span className="ftoi-legend-item">
            <span className="ftoi-legend-dot nominated" />
            Added
          </span>
          <span className="ftoi-legend-item">
            <i className="pi pi-star-fill" style={{ fontSize: "11px", color: "#e6a817" }} />
            Priority
          </span>
        </div>
      </div>

      <div className="ftoi-active-panel-body">
        {pathwayKeys.length === 0 ? (
          <div className="ftoi-empty-msg">No active targets.</div>
        ) : (
          <div className="ftoi-pathways-grid">
            {pathwayKeys.map((pathway) => (
              <div key={pathway} className="ftoi-pathway-row">
                <span className="ftoi-pathway-label">{pathway}</span>
                <div className="ftoi-chips-wrap">
                  {byPathway[pathway].map((target) => (
                    <span
                      key={target.id}
                      className={`ftoi-chip ${target.deltaType}${
                        selectedTargetId === target.id ? " selected" : ""
                      }`}
                      onClick={() => onChipClick(target)}
                      title={target.fullName || "Drag to remove"}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.effectAllowed = "move";
                        onDragStart(target);
                      }}
                    >
                      {target.name}
                      {target.isPriority && <i className="pi pi-star-fill ftoi-chip-priority-star" title="Priority target" />}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default observer(FTTOIActivePanel);
