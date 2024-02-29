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
  let OngoingTemplate = () => {
    return <span>Ongoing</span>;
  };
  return rowData.endDate ? (
    <FDate timestamp={rowData.endDate} hideTime={true} />
  ) : (
    OngoingTemplate()
  );
};
