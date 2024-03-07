export const sidePanelItems = (navigate) => {
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
      label: "Actions",
      items: [
        {
          label: "Edit Screen",
          icon: "icon icon-common icon-edit",
          command: () => {
            setDisplayEditScreenDialog(true);
          },
        },
        {
          label: "Merge Screens",
          icon: "icon icon-common icon-compress",
          command: () => {
            setDisplayMergeScreenDialog(true);
          },
        },
      ],
    },
  ];
};
