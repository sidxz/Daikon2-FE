export const sidePanelItems = (navigate, getRelatedScreens) => {
  let relatedScreens = getRelatedScreens();

  // check if URL contains "hits" or "screens"
  let url = window.location.href;
  let isHits = url.includes("hits");

  let relatedScreensItems = relatedScreens.map((screen) => {
    return {
      label: screen.name,
      icon: "icon icon-common icon-search",
      command: () => {
        navigate(
          "/wf/screen/viewer/tb/" + screen.id + (isHits ? "/hits/" : "/")
        );
      },
    };
  });
  return [
    {
      label: "Sections",
      items: [
        {
          label: "Screens",
          icon: "icon icon-common icon-circle-notch",
          command: () => {
            navigate("screens/");
          },
        },
        {
          label: "Hits",
          icon: "icon icon-conceptual icon-structures-3d",
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
