import { FaDochub } from "react-icons/fa";
import { AppRoleResolver } from "../../../../Shared/VariableResolvers/AppRoleResolver";
import { PortfolioAdminRoleName } from "../constants/roles";

export const sidePanelItems = (navigate) => {
  const { isUserInAnyOfRoles } = AppRoleResolver();
  var items = [];
  items.push({
    label: "Sections",
    items: [
      {
        label: "Portfolio Information",
        icon: "icon icon-common icon-circle-notch",
        command: () => {
          navigate("information/");
        },
      },
      {
        label: "Documents",
        icon: <FaDochub className="mr-2" />,
        command: () => {
          navigate("docs/");
        },
      },
      {
        label: "Discussion",
        icon: "ri-discuss-line",
        command: () => {
          navigate("discussion/");
        },
      },
    ],
  });

  if (isUserInAnyOfRoles([PortfolioAdminRoleName])) {
    items.push({
      label: "Admin Section",
      items: [
        {
          label: "Settings",
          icon: "pi pi-cog",
          command: () => {
            navigate("settings/");
          },
        },
      ],
    });
  }

  return items;
};
