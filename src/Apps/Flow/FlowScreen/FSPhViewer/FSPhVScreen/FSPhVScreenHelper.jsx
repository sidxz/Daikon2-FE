import { Button } from "primereact/button";
import FDate from "../../../../../Library/FDate/FDate";

export const breadCrumbItems = (selectedScreen, navigate) => {
  return [
    {
      label: "Screens",
      command: () => {
        navigate("/wf/screen/dash/phenotypic/");
      },
    },
    {
      label: selectedScreen.name,
      command: () => {
        navigate(`/wf/screen/viewer/ph/${selectedScreen.id}`);
      },
    },
    { label: "Screen Runs" },
  ];
};

export const ProtocolHeaderTemplate = (
  isProtocolExpanded,
  setIsProtocolExpanded
) => {
  return (
    <div className="flex align-items-center min-w-max">
      <div className="flex">Protocol</div>
      <div className="flex">
        {!isProtocolExpanded && (
          <Button
            size="small"
            link
            label="| Expand"
            onClick={() => setIsProtocolExpanded(true)}
          />
        )}
        {isProtocolExpanded && (
          <Button
            size="small"
            link
            label="| Collapse"
            onClick={() => setIsProtocolExpanded(false)}
          />
        )}
      </div>
    </div>
  );
};

export const ProtocolBodyTemplate = (rowData, isProtocolExpanded) => {
  if (!isProtocolExpanded) {
    return (
      <div
        className="surface-overlay white-space-nowrap overflow-hidden text-overflow-ellipsis"
        style={{ width: "200px" }}
      >
        {rowData.protocol}
      </div>
    );
  }
  return <div className="fadein">{rowData.protocol}</div>;
};

export const StartDateTemplate = (rowData) => {
  return <FDate timestamp={rowData.startDate} hideTime={true} />;
};
export const EndDateTemplate = (rowData) => {
  const isOngoing =
    !rowData.endDate ||
    rowData.endDate === "0001-01-01T00:00:00" ||
    rowData.endDate === "0001-01-01T00:00:00Z";

  const OngoingTemplate = () => <span>Ongoing</span>;

  return isOngoing ? (
    OngoingTemplate()
  ) : (
    <FDate timestamp={rowData.endDate} hideTime={true} />
  );
};
