export const sidePanelItems = (navigate) => {
  return [
    {
      label: "Sections",
      items: [],
    },
    {
      label: "Actions",
      items: [],
    },
  ];
};

export const breadCrumbItems = (navigate) => {
  return [
    {
      label: "MolecuLogix",
      command: () => {
        navigate("/moleculogix/");
      },
    },
    {
      label: "Search",
    },
  ];
};
