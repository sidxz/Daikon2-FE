import { diffWords } from "diff";
import DOMPurify from "dompurify";
import { startCase } from "lodash";
import { Timeline } from "primereact/timeline";
import { AppUserResolver } from "../../Shared/VariableResolvers/AppUserResolver";
/**
 * Highlights differences between two versions using <ins> and <del> styling.
 */
const getHighlightedDiff = (oldStr, newStr) => {
  const diff = diffWords(oldStr || "", newStr || "");
  const result = diff
    .map((part) => {
      if (part.added)
        return `<ins style="background:#c8e6c9;">${part.value}</ins>`;
      if (part.removed)
        return `<del style="background:#ffcdd2;text-decoration:line-through;">${part.value}</del>`;
      return part.value;
    })
    .join("");
  return DOMPurify.sanitize(result);
};

const FieldDiffTimeline = ({ history, field }) => {
  const { getIdFromUserFullName, getUserFullNameById } = AppUserResolver();
  if (!Array.isArray(history) || history.length === 0 || !field) {
    return <p>No history available.</p>;
  }

  const timelineItems = [];
  // reversed the order to show the latest changes first
  history = history.slice().reverse();

  // Loop forward through the history (oldest to latest)
  for (let i = 0; i < history.length; i++) {
    const current = history[i];
    const version = i + 1;
    const currentValue = current[field] || "";
    const prevValue = i > 0 ? history[i - 1][field] || "" : null;

    const htmlDiff =
      prevValue !== null
        ? getHighlightedDiff(prevValue, currentValue) // changes appear in the new version
        : DOMPurify.sanitize(currentValue); // first version, show as-is

    timelineItems.push({
      version,
      eventType: current.EventType,
      htmlDiff,
      time: new Date(current.TimeStamp).toLocaleString(),
      user:
        getUserFullNameById(current.LastModifiedById) ||
        "Unknown User / System",
    });
  }

  const customizedTemplate = (item) => (
    <div className="flex flex-column gap-2 p-2 border-1 border-50 border-round-sm mb-2">
      <div className="flex justify-content-between align-items-center mb-1">
        <small>{item.time}</small>
        <small>{item.user}</small>
      </div>
      <div
        className="text-justify"
        style={{ whiteSpace: "pre-wrap" }}
        dangerouslySetInnerHTML={{ __html: item.htmlDiff }}
      />
    </div>
  );

  const oppositeTemplate = (item) => (
    <div className="flex flex-column gap-1">
      <span className="font-bold">{startCase(item.eventType)}</span>
      <span>{item.user}</span> <span className="text-sm">{item.time}</span>
    </div>
  );

  return (
    <div className="flex flex-column border-1 border-50 border-round-md p-3">
      <Timeline
        value={timelineItems.reverse()} // reverse to show latest first
        opposite={oppositeTemplate}
        content={customizedTemplate}
        align="right"
        className="customized-timeline"
      />
    </div>
  );
};

export default FieldDiffTimeline;
