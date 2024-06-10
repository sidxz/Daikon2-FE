import { AppRoleResolver } from "../../../../Shared/VariableResolvers/AppRoleResolver";
import { HaAdminRoleName } from "../constants/roles";

export const sidePanelItems = (navigate) => {
  const { isUserInAnyOfRoles } = AppRoleResolver();
  var items = [];
  items.push({
    label: "Sections",
    items: [
      {
        label: "HA Information",
        icon: "icon icon-common icon-circle-notch",
        command: () => {
          navigate("information/");
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

  if (isUserInAnyOfRoles([HaAdminRoleName])) {
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
