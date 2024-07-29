

export const sidePanelItems = (navigate) => {
  var sideMenu = [];
  sideMenu.push({
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
        label: "Safety Assessment",
        icon: "pi pi-file-word",
        command: () => {
          navigate(`safety-assessment/`);
        },
      },
    ],
  });

  return sideMenu;
};
