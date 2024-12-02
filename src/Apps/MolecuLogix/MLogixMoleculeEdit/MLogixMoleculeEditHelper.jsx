export const sidePanelItems = (navigate, selectedMolecule) => {
  return [
    {
      label: "Sections",
      items: [
        {
          label: "View Molecule",
          icon: "icon icon-common icon-math",
          command: () => {
            navigate(`/moleculogix/molecule/${selectedMolecule.id}`);
          },
        },
      ],
    },
  ];
};

export const breadCrumbItems = (selectedMolecule, navigate) => {
  return [
    {
      label: "MolecuLogix",
      command: () => {
        navigate("/moleculogix/");
      },
    },
    {
      label: selectedMolecule.name,
      command: () => {
        navigate(`/moleculogix/molecule/${selectedMolecule.id}`);
      },
    },
    {
      label: "Edit",
    },
  ];
};
