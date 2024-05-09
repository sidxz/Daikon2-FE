export const sidePanelItems = (navigate) => {
  return [
    {
      label: "Sections",
      items: [
        {
          label: "Users",
          icon: "pi pi-fw pi-user-plus",
          command: () => {
            navigate(`/admin/user-management/users`);
          },
        },
        {
          label: "Organizations",
          icon: "pi pi-fw pi-users",
          command: () => {
            navigate(`/admin/user-management/orgs/`);
          },
        },
      ],
    },
  ];
};
