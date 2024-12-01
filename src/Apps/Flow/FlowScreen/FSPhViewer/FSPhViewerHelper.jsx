import { FaDochub } from "react-icons/fa";
import { HitCollectionIcon } from "../../icons/HitCollectionIcon";
import { PhenoScreenIcon } from "../../icons/PhenoScreenIcon";

export const sidePanelItems = (navigate, renderAdminModules) => {
  const menuItems = [];
  menuItems.push({
    label: "Sections",
    items: [
      {
        label: "Screens",
        icon: <PhenoScreenIcon size={"18em"} grayscale={1} />,
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

  if (renderAdminModules) {
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
