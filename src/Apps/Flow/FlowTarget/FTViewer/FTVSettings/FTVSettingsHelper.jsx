export const breadCrumbItems = (selectedTarget, navigate) => {
  return [
    {
      label: "Targets",
      command: () => {
        navigate("/wf/target/");
      },
    },
    {
      label: selectedTarget.name,
      command: () => {
        navigate(`/wf/target/viewer/${selectedTarget.id}`);
      },
    },
    { label: "Settings" },
  ];
};
