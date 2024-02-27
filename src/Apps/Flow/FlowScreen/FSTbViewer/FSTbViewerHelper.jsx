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
          label: "Add a Screen",
          icon: "icon icon-common icon-database-submit",
          command: () => {
            setDisplayPromotionDialog(true);
          },
        },
      ],
    },

    {
      label: "Admin Section",
      items: [
        {
          label: "Edit",
          icon: "icon icon-common icon-edit",
          command: () => {
            setDisplayEditScreenDialog(true);
          },
        },
        {
          label: "Merge",
          icon: "icon icon-common icon-compress",
          command: () => {
            setDisplayMergeScreenDialog(true);
          },
        },
        {
          label: "Update Target Association",
          icon: "icon icon-common icon-target",
          command: () => {
            navigate("update-target-association/");
          },
        },
        {
          label: "Delete",
          icon: "icon icon-common icon-remove",
          command: () => {
            navigate("delete/");
          },
        },
      ],
    },
  ];
};
