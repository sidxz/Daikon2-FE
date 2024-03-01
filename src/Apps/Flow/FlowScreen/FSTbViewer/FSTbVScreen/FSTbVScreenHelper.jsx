import FDate from "../../../../../Library/FDate/FDate";

export const breadCrumbItems = (selectedScreen, navigate) => {
  return [
    {
      label: "Screens",
      command: () => {
        navigate("/wf/screen/");
      },
    },
    {
      label: selectedScreen.name,
      command: () => {
        navigate(`/wf/screen/viewer/tb/${selectedScreen.id}`);
      },
    },
    { label: "Screen Sequences" },
  ];
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
