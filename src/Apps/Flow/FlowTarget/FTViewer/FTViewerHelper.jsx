import { AiTwotoneSafetyCertificate } from "react-icons/ai";
import { AppRoleResolver } from "../../../../Shared/VariableResolvers/AppRoleResolver";
import { AIDocumentIcon } from "../../icons/AIDocumentIcon";
import { TargetAdminRoleName } from "../constants/roles";

export const sidePanelItems = (navigate) => {
  const { isUserInAnyOfRoles } = AppRoleResolver();

  var sideMenu = [];
  sideMenu.push({
    label: "Sections",
    items: [
      {
        label: "Compass",
        icon: "icon icon-common icon-compass",
        command: () => {
          navigate(`compass/`);
        },
      },
      {
        label: "Safety Assessment",
        icon: <AiTwotoneSafetyCertificate className="flex mr-2" />,
        command: () => {
          navigate(`safety-assessment/`);
        },
      },
      {
        label: "Scorecard",
        icon: "icon icon-common icon-flag-checkered",
        command: () => {
          navigate(`scorecard/`);
        },
      },

      {
        label: "Promotion Info",
        icon: "icon icon-common icon-info",
        command: () => {
          navigate(`promotion-questionnaire/`);
        },
      },
      {
        label: "Documents",
        icon: <AIDocumentIcon className="mr-2" />,
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

  if (isUserInAnyOfRoles([TargetAdminRoleName])) {
    sideMenu.push({
      label: "Admin",
      items: [
        {
          label: "Impact Values",
          icon: "icon icon-common icon-bolt",
          command: () => {
            navigate("impact/");
          },
        },
        {
          label: "Settings",
          icon: "pi pi-cog",
          command: () => {
            navigate(`settings/`);
          },
        },
      ],
    });
  }

  return sideMenu;
};
