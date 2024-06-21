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
    {
      label: "Actions",
      items: [
        {
          label: "Edit Molecule",
          icon: "icon icon-common icon-edit",
          command: () => {
            navigate(`/moleculogix/molecule/${selectedMolecule.id}/edit`);
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
