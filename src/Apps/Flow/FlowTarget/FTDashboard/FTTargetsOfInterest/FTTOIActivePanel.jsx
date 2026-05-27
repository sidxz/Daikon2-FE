import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { RootStoreContext } from "../../../../../RootStore";

const FTTOIActivePanel = ({ onChipClick, selectedTargetId, onDragStart, onDrop }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showNewOnly, setShowNewOnly] = useState(false);
  const rootStore = useContext(RootStoreContext);
  const { activeTargets, selectedCohort, cohorts, selectedCohortIndex } =
    rootStore.targetNominationStore;

  const isFirst = selectedCohortIndex === 0;
  const isLatest = selectedCohortIndex === cohorts.length - 1;

  useEffect(() => { setShowNewOnly(false); }, [selectedCohort]);
  const cohortLabel = isLatest ? "Latest" : selectedCohort;

  // Group by pathway, optionally filtering to newly added targets only
  const visibleTargets = showNewOnly
    ? activeTargets.filter((t) => t.deltaType === "nominated")
    : activeTargets;

  const byPathway = {};
  visibleTargets.forEach((target) => {
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
            <span className="ftoi-legend-dot tier-1" />
            Top 4
          </span>
          {!isFirst && (
            <span
              className={`ftoi-legend-item ftoi-legend-filter${showNewOnly ? " active" : ""}`}
              onClick={() => setShowNewOnly((v) => !v)}
              title="Click to filter: show only newly added targets"
            >
              <span className="ftoi-chip-new-badge" style={{ marginLeft: 0 }}>NEW</span>
              Added this review
            </span>
          )}
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
                  {byPathway[pathway].map((target) => {
                    const tierClass = target.tier === 1 ? "tier-1" : "";
                    return (
                      <span
                        key={target.id}
                        className={`ftoi-chip ${tierClass}${
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
                        {!isFirst && target.deltaType === "nominated" && (
                          <span className="ftoi-chip-new-badge">NEW</span>
                        )}
                      </span>
                    );
                  })}
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
