export const sidePanelItems = (navigate) => {
  return [
    {
      label: "Sections",
      items: [
        {
          label: "Compass",
          icon: "icon icon-common icon-compass",
          command: () => {
            navigate(`private/`);
          },
        },
        {
          label: "Scorecard",
          icon: "icon icon-common icon-flag-checkered",
          command: () => {
            navigate(`public/`);
          },
        },

        {
          label: "Promotion Info",
          icon: "icon icon-common icon-info",
          command: () => {
            navigate(`discussion/`);
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
          label: "Promote to Target",
          icon: "pi pi-external-link",
          command: () => {
            navigate(`promote/`);
          },
        },
      ],
    },
  ];
};
