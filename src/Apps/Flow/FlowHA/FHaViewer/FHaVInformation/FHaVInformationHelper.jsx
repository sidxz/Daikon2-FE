export const breadCrumbItems = (navigate, selectedHA) => [
  {
    label: "HAs",
    command: () => {
      navigate("/wf/ha/");
    },
  },
  {
    label: selectedHA.name,
    command: () => {
      navigate(`/wf/ha/viewer/${selectedHA.name}`);
    },
  },
  { label: "Information" },
];
