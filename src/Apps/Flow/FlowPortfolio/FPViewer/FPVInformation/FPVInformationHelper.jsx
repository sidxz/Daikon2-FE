export const breadCrumbItems = (navigate, selectedProject) => [
  {
    label: "Portfolios",
    command: () => {
      navigate("/wf/portfolio/");
    },
  },
  {
    label: selectedProject.name,
    command: () => {
      navigate(`/wf/portfolio/viewer/${selectedProject.id}`);
    },
  },
  { label: "Information" },
];
