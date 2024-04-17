export const breadCrumbItems = (selectedProject, navigate) => {
  return [
    {
      label: "Portfolio",
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
    { label: "Settings" },
  ];
};
