import { Menubar } from "primereact/menubar";
import React from "react";
import { ImDownload } from "react-icons/im";
import { ExportHitsToExcel } from "./FSTbVHExcelExport";
import { DtFieldsToExcelColumnMapping } from "./FSTbVHitsConstants";
export const FSTbVHDataTableHeader = ({
  showAddHitSideBar,
  selectedHitCollection,
  selectedScreen,
}) => {
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
        {
          label: "Export Hits",
          icon: (
            <div className="flex pr-2">
              <ImDownload />
            </div>
          ),
          command: () =>
            ExportHitsToExcel(
              selectedHitCollection,
              selectedScreen,
              DtFieldsToExcelColumnMapping
            ),
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
