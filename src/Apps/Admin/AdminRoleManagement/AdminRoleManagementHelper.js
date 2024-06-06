export const sidePanelItems = (navigate) => {
  return [
    {
      label: "Sections",
      items: [
        {
          label: "Roles",
          icon: "pi pi-fw pi-user-plus",
          command: () => {
            navigate(`/admin/role-management/roles`);
          },
        },
      ],
    },
  ];
};
