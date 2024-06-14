import { AppRoleResolver } from "../../../../Shared/VariableResolvers/AppRoleResolver";
import { HitCollectionIcon } from "../../icons/HitCollectionIcon";
import { ScreenIcon } from "../../icons/ScreenIcon";
import { ScreenAdminRoleName } from "../constants/roles";

export const sidePanelItems = (navigate, getRelatedScreens) => {
  let relatedScreens = getRelatedScreens();
  const { isUserInAnyOfRoles } = AppRoleResolver();

  // check if URL contains "hits" or "screens"
  let url = window.location.href;
  let isHits = url.includes("hits");

  let relatedScreensItems = relatedScreens.map((screen) => {
    return {
      label: screen.name,
      icon: <ScreenIcon size={"18em"} grayscale={1} />,
      command: () => {
        navigate(
          "/wf/screen/viewer/tb/" + screen.id + (isHits ? "/hits/" : "/")
        );
      },
    };
  });
  let menuItems = [
    {
      label: "Sections",
      items: [
        {
          label: "Screens",
          icon: <ScreenIcon size={"18em"} grayscale={1} />,
          command: () => {
            navigate("screens/");
          },
        },
        {
          label: "Hits",
          icon: <HitCollectionIcon size={"18em"} grayscale={1} />,
          command: () => {
            navigate("hits/");
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
    },
    {
      label: "Related Screens",
      items: [...relatedScreensItems],
    },
  ];

  if (isUserInAnyOfRoles([ScreenAdminRoleName])) {
    menuItems.push({
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

  return menuItems;
};
