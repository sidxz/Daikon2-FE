import { observer } from "mobx-react-lite";
import { Dialog } from "primereact/dialog";
import { useContext, useEffect, useRef, useState } from "react";
import { RootStoreContext } from "../../../../../RootStore";
import "./FTTargetsOfInterest.css";
import FTTOIActivePanel from "./FTTOIActivePanel";
import FTTOIDetailDrawer from "./FTTOIDetailDrawer";
// import FTTOIRemovedPanel from "./FTTOIRemovedPanel";
import FTTOIStatsBar from "./FTTOIStatsBar";
import FTTOITimeline from "./FTTOITimeline";

const FTTargetsOfInterest = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    fetchCohorts,
    fetchNominations,
    isFetchingCohorts,
    cohorts,
    selectedCohort,
    setSelectedTarget,
    selectedTarget,
    addTargetEvent,
    isAddingEvent,
  } = rootStore.targetNominationStore;
  const { user, appVars } = rootStore.authStore;
  const authorName = (user && appVars?.userNames?.[user.id]) || user?.id || "Unknown";

  const [localSelectedTarget, setLocalSelectedTarget] = useState(null);
  const dragTarget = useRef(null);
  const [removalTarget, setRemovalTarget] = useState(null);
  const [removalReason, setRemovalReason] = useState("");
  const [reinstatementTarget, setReinstatementTarget] = useState(null);
  const [reinstatementReason, setReinstatementReason] = useState("");

  // Load cohorts on mount
  useEffect(() => {
    if (!cohorts.length && !isFetchingCohorts) {
      fetchCohorts();
    }
  }, [cohorts, isFetchingCohorts, fetchCohorts]);

  // Fetch nominations whenever selected cohort changes
  useEffect(() => {
    if (selectedCohort) {
      fetchNominations(selectedCohort);
      // Close drawer when timeline changes
      setLocalSelectedTarget(null);
      setSelectedTarget(null);
    }
  }, [selectedCohort, fetchNominations, setSelectedTarget]);

  const handleChipClick = (target) => {
    if (localSelectedTarget?.id === target.id) {
      // Deselect
      setLocalSelectedTarget(null);
      setSelectedTarget(null);
    } else {
      setLocalSelectedTarget(target);
      setSelectedTarget(target);
    }
  };

  const handleDrawerClose = () => {
    setLocalSelectedTarget(null);
    setSelectedTarget(null);
  };

  const handleDragStart = (target) => {
    dragTarget.current = target;
  };

  // const handleDropOnRemoved = () => {
  //   if (!dragTarget.current) return;
  //   setRemovalTarget(dragTarget.current);
  //   setRemovalReason("");
  //   dragTarget.current = null;
  // };

  const handleRemovalSave = async () => {
    if (!removalReason.trim() || !removalTarget) return;
    await addTargetEvent(removalTarget.id, {
      type: "removed",
      reason: removalReason.trim(),
      author: authorName,
    });
    setRemovalTarget(null);
    setRemovalReason("");
    // Close drawer if the removed target was selected
    setLocalSelectedTarget(null);
    setSelectedTarget(null);
  };

  const handleRemovalCancel = () => {
    setRemovalTarget(null);
    setRemovalReason("");
  };

  const handleDropOnActive = () => {
    if (!dragTarget.current) return;
    setReinstatementTarget(dragTarget.current);
    setReinstatementReason("");
    dragTarget.current = null;
  };

  const handleReinstatementSave = async () => {
    if (!reinstatementReason.trim() || !reinstatementTarget) return;
    await addTargetEvent(reinstatementTarget.id, {
      type: "nominated",
      reason: reinstatementReason.trim(),
      author: authorName,
    });
    setReinstatementTarget(null);
    setReinstatementReason("");
    setLocalSelectedTarget(null);
    setSelectedTarget(null);
  };

  const handleReinstatementCancel = () => {
    setReinstatementTarget(null);
    setReinstatementReason("");
  };

  if (isFetchingCohorts) {
    return (
      <div className="flex align-items-center justify-content-center p-4">
        <i className="pi pi-spin pi-spinner mr-2" />
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-column gap-2 w-full fadein animation-duration-500 p-2">
      {/* Control row: slider + stats */}
      <div className="ftoi-control-row">
        <FTTOITimeline />
        <FTTOIStatsBar />
      </div>

      {/* Main panels */}
      <div className="ftoi-panels">
        <FTTOIActivePanel
          onChipClick={handleChipClick}
          selectedTargetId={localSelectedTarget?.id}
          onDragStart={handleDragStart}
          onDrop={handleDropOnActive}
        />
        {/* <FTTOIRemovedPanel
          onChipClick={handleChipClick}
          selectedTargetId={localSelectedTarget?.id}
          onDrop={handleDropOnRemoved}
          onDragStart={handleDragStart}
        /> */}
      </div>

      {/* Detail drawer */}
      {localSelectedTarget && (
        <FTTOIDetailDrawer
          target={localSelectedTarget}
          onClose={handleDrawerClose}
        />
      )}

      {/* Reinstatement confirmation dialog */}
      <Dialog
        visible={!!reinstatementTarget}
        onHide={handleReinstatementCancel}
        header={`Reinstate ${reinstatementTarget?.name}?`}
        style={{ width: "420px" }}
        footer={
          <div className="ftoi-removal-dialog-footer">
            <button className="ftoi-removal-btn cancel" onClick={handleReinstatementCancel}>
              Cancel
            </button>
            <button
              className="ftoi-removal-btn reinstate"
              onClick={handleReinstatementSave}
              disabled={isAddingEvent || !reinstatementReason.trim()}
            >
              {isAddingEvent ? "Saving..." : "Confirm Reinstatement"}
            </button>
          </div>
        }
      >
        <p className="ftoi-removal-dialog-desc">
          Please provide a reason for reinstating <strong>{reinstatementTarget?.name}</strong>.
        </p>
        <textarea
          className="ftoi-removal-textarea"
          placeholder="Reason for reinstatement..."
          value={reinstatementReason}
          onChange={(e) => setReinstatementReason(e.target.value)}
          autoFocus
          rows={4}
        />
      </Dialog>

      {/* Removal confirmation dialog */}
      <Dialog
        visible={!!removalTarget}
        onHide={handleRemovalCancel}
        header={`Remove ${removalTarget?.name}?`}
        style={{ width: "420px" }}
        footer={
          <div className="ftoi-removal-dialog-footer">
            <button className="ftoi-removal-btn cancel" onClick={handleRemovalCancel}>
              Cancel
            </button>
            <button
              className="ftoi-removal-btn confirm"
              onClick={handleRemovalSave}
              disabled={isAddingEvent || !removalReason.trim()}
            >
              {isAddingEvent ? "Saving..." : "Confirm Removal"}
            </button>
          </div>
        }
      >
        <p className="ftoi-removal-dialog-desc">
          Please provide a reason for removing <strong>{removalTarget?.name}</strong>.
        </p>
        <textarea
          className="ftoi-removal-textarea"
          placeholder="Reason for removal..."
          value={removalReason}
          onChange={(e) => setRemovalReason(e.target.value)}
          autoFocus
          rows={4}
        />
      </Dialog>
    </div>
  );
};

export default observer(FTTargetsOfInterest);
