import { AppRoleResolver } from "../../../Shared/VariableResolvers/AppRoleResolver";
import { AIDocumentIcon } from "../../Flow/icons/AIDocumentIcon";
import { MLogixAdminRoleName } from "../constants/roles";

export const sidePanelItems = (navigate, selectedMolecule) => {
  const { isUserInAnyOfRoles } = AppRoleResolver();

  let items = [
    {
      label: "Sections",
      items: [
        {
          label: "Molecule",
          icon: "icon icon-common icon-math",
          command: () => {
            navigate(`/moleculogix/molecule/${selectedMolecule.id}`);
          },
        },
        {
          label: "Documents",
          icon: <AIDocumentIcon className="mr-2" />,
          command: () => {
            navigate(`/moleculogix/molecule/${selectedMolecule.id}/docs/`);
          },
        },
        {
          label: "Discussion",
          icon: "ri-discuss-line",
          command: () => {},
        },
      ],
    },
  ];

  if (isUserInAnyOfRoles([MLogixAdminRoleName])) {
    items.push({
      label: "Actions",
      items: [
        {
          label: "Find Similar Molecules",
          icon: "icon icon-common icon-database-submit",
          command: () => {
            navigate(
              `/moleculogix/search?smiles=${selectedMolecule.smilesCanonical}&searchType=similarity`
            );
          },
        },

        {
          label: "Edit Molecule",
          icon: "icon icon-common icon-edit",
          command: () => {
            navigate(`/moleculogix/molecule/${selectedMolecule.id}/edit`);
          },
        },
      ],
    });
  } else {
    items.push({
      label: "Actions",
      items: [
        {
          label: "Find Similar Molecules",
          icon: "icon icon-common icon-database-submit",
          command: () => {
            navigate(
              `/moleculogix/search?smiles=${selectedMolecule.smilesCanonical}&searchType=similarity`
            );
          },
        },
      ],
    });
  }

  return items;
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
  ];
};
