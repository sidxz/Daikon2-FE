export const breadCrumbItems = (navigate, selectedProject) => [
  {
    label: "Post Portfolios",
    command: () => {
      navigate("/wf/post-portfolio/");
    },
  },
  {
    label: selectedProject.name,
    command: () => {
      navigate(`/wf/post-portfolio/viewer/${selectedProject.id}`);
    },
  },
  { label: "Information" },
];
