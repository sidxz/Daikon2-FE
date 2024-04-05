import { HitCollectionIcon } from "../../icons/HitCollectionIcon";
import { PhenoScreenIcon } from "../../icons/PhenoScreenIcon";

export const sidePanelItems = (navigate) => {
  return [
    {
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
          label: "Discussion",
          icon: "ri-discuss-line",
          command: () => {
            navigate("discussion/");
          },
        },
      ],
    },

    {
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
    },
  ];
};
