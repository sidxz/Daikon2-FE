export const breadCrumbItems = (selectedHa, navigate) => {
    return [
      {
        label: "HAs",
        command: () => {
          navigate("/wf/ha/");
        },
      },
      {
        label: selectedHa.name,
        command: () => {
          navigate(`/wf/portfolio/viewer/${selectedHa.id}`);
        },
      },
      { label: "Settings" },
    ];
  };
  