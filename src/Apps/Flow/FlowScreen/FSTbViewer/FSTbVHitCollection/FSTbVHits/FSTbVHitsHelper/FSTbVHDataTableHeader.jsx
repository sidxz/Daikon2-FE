import { Menubar } from "primereact/menubar";
import React from "react";

export const FSTbVHDataTableHeader = ({ showAddHitSideBar }) => {
  let tableMenuItems = [
    {
      label: "Hits Management",
      icon: "icon icon-conceptual icon-structures-3d",
      items: [
        {
          label: "Add Hit",
          icon: "pi pi-plus",
          command: () => showAddHitSideBar(),
        },
      ],
    },
  ];

  return (
    <div className="flex w-full">
      <div className="flex w-full">
        <Menubar
          model={tableMenuItems}
          style={{ position: "sticky", zIndex: 2 }}
        />
      </div>
    </div>
  );
};
