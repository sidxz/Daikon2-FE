export const breadCrumbItems = (selectedProject, navigate) => {
  return [
    {
      label: "Post Portfolio",
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
    { label: "Settings" },
  ];
};
