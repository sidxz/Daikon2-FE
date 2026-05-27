import { observer } from "mobx-react-lite";
import { useContext, useState } from "react";
import Horizon from "../../../../../Library/Horizon/Horizon";
import { RootStoreContext } from "../../../../../RootStore";

const EVENT_TYPE_LABELS = {
  nominated: "Added",
  retained: "Retained",
  removed: "Removed",
  note: "Note",
};

const ActivityLog = ({ events, isLoading }) => {
  if (isLoading) {
    return <div className="ftoi-horizon-empty">Loading activity...</div>;
  }
  if (!events || events.length === 0) {
    return <div className="ftoi-horizon-empty">No activity recorded.</div>;
  }

  return (
    <div className="ftoi-activity-log">
      {events.map((event, i) => (
        <div key={i} className="ftoi-log-entry">
          <div className="ftoi-log-timeline">
            <span className={`ftoi-log-dot ${event.type || "note"}`} />
            {i < events.length - 1 && <div className="ftoi-log-segment" />}
          </div>
          <div className="ftoi-log-content">
            <div className="ftoi-log-heading">
              {EVENT_TYPE_LABELS[event.type] || event.type} &middot; {event.cohort}
            </div>
            <div className="ftoi-log-meta">
              {event.date}{event.author ? ` · ${event.author}` : ""}
            </div>
            {event.reason && (
              <div className="ftoi-log-reason">{event.reason}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

/* const AddNoteForm = ({ targetId }) => {
  const rootStore = useContext(RootStoreContext);
  const { addTargetEvent, isAddingEvent } = rootStore.targetNominationStore;
  const { user, appVars } = rootStore.authStore;
  const authorName = (user && appVars?.userNames?.[user.id]) || user?.id || "Unknown";

  const [noteType, setNoteType] = useState("note");
  const [reason, setReason] = useState("");

  const handleSave = async () => {
    if (!reason.trim()) return;
    await addTargetEvent(targetId, {
      type: noteType,
      reason: reason.trim(),
      author: authorName,
    });
    setReason("");
  };

  return (
    <div className="ftoi-add-note">
      <select value={noteType} onChange={(e) => setNoteType(e.target.value)}>
        <option value="note">General note</option>
        <option value="nominated">Add for next cycle</option>
        <option value="retained">Mark as retained</option>
        <option value="removed">Remove</option>
      </select>
      <textarea
        placeholder="Reason or observation..."
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
      <button
        className="ftoi-save-btn"
        onClick={handleSave}
        disabled={isAddingEvent || !reason.trim()}
      >
        {isAddingEvent ? "Saving..." : "Save"}
      </button>
    </div>
  );
}; */

const CollapsiblePanel = ({ title, defaultOpen, children }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="ftoi-collapsible">
      <div
        className="ftoi-collapsible-header"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="ftoi-collapsible-title">{title}</span>
        <i
          className={`pi ${open ? "pi-chevron-up" : "pi-chevron-down"} ftoi-collapsible-toggle`}
        />
      </div>
      {open && <div className="ftoi-collapsible-body">{children}</div>}
    </div>
  );
};

const FTTOIDetailDrawer = ({ target, onClose }) => {
  const rootStore = useContext(RootStoreContext);
  const { targetEvents, isFetchingTargetEvents } = rootStore.targetNominationStore;
  const { isFetchingHorizon, selectedHorizon } = rootStore.horizonStore;

  if (!target) return null;

  const badgeType = target.deltaType || "retained";
  const badgeLabel =
    badgeType === "nominated"
      ? "Added"
      : badgeType === "removed"
      ? "Removed"
      : "Retained";

  return (
    <div className="ftoi-drawer">
      <div className="ftoi-drawer-header">
        <div className="ftoi-drawer-header-left">
          <span className={`ftoi-badge ${badgeType}`}>{badgeLabel}</span>
          <div>
            <div className="ftoi-drawer-target-name">{target.name}</div>
            <div className="ftoi-drawer-target-fullname">{target.fullName}</div>
          </div>
        </div>
        <button className="ftoi-drawer-close" onClick={onClose} title="Close">
          &times;
        </button>
      </div>

      <div className="ftoi-drawer-body">
        <CollapsiblePanel title="Horizon View" defaultOpen={true}>
          <Horizon entryPoint={target.id} />
          {!isFetchingHorizon && !selectedHorizon && (
            <div className="ftoi-horizon-empty">No pipeline data available.</div>
          )}
        </CollapsiblePanel>

        <CollapsiblePanel title="Activity Log" defaultOpen={false}>
          <ActivityLog
            events={targetEvents}
            isLoading={isFetchingTargetEvents}
          />
        </CollapsiblePanel>
      </div>
    </div>
  );
};

export default observer(FTTOIDetailDrawer);
