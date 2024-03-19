export const sidePanelItems = (navigate) => {
  return [
    {
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
            navigate(`promotion-info/`);
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
          label: "Promote to Screen",
          icon: "pi pi-external-link",
          command: () => {
            navigate(`promote/`);
          },
        },
      ],
    },
  ];
};
