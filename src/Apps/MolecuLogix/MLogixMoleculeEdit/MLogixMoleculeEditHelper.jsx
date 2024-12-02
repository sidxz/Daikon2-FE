export const sidePanelItems = (navigate, selectedMolecule) => {
  return [
    {
      label: "Sections",
      items: [
        {
          label: "View Molecule",
          icon: "icon icon-conceptual icon-structures-3d",
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
