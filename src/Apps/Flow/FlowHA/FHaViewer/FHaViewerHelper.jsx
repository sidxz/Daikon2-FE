export const sidePanelItems = (navigate) => {
  return [
    {
      label: "Sections",
      items: [
        {
          label: "HA Information",
          icon: "icon icon-common icon-circle-notch",
          command: () => {
            navigate("information/");
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
          label: "Promote to H2L",
          icon: "pi pi-external-link",
          command: () => {
            navigate(`promote/`);
          },
        },
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
