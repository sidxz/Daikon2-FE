import { HitCollectionIcon } from "../../icons/HitCollectionIcon";
import { ScreenIcon } from "../../icons/ScreenIcon";

export const sidePanelItems = (
  navigate,
  getRelatedScreens,
  renderAdminModules
) => {
  let relatedScreens = getRelatedScreens();

  // check if URL contains "hits" or "screens"
  let url = window.location.href;
  let isHits = url.includes("hits");

  let relatedScreensItems = relatedScreens.map((screen) => {
    return {
      label: screen.name,
      icon: <ScreenIcon size={"18em"} grayscale={1} />,
      command: () => {
        // console.log(
        //   "NAV:",
        //   "/wf/screen/viewer/tb/" + screen.name + (isHits ? "/hits/" : "/")
        // );
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
