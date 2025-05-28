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
          command: () => {},
        },
        {
          label: "Discussion",
          icon: "ri-discuss-line",
          command: () => {
            navigate(
              `/moleculogix/molecule/${selectedMolecule.id}/discussion/`
            );
          },
        },
      ],
    },
  ];

  if (isUserInAnyOfRoles([MLogixAdminRoleName]) && selectedMolecule?.smiles) {
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
  } else if (selectedMolecule?.smiles) {
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
  } else {
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
