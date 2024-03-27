export const breadCrumbItems = (navigate, selectedHa) => [
  {
    label: "HAs",
    command: () => {
      navigate("/wf/ha/");
    },
  },
  {
    label: selectedHa.name,
    command: () => {
      navigate(`/wf/ha/viewer/${selectedHa.name}`);
    },
  },
  { label: "Information" },
];
