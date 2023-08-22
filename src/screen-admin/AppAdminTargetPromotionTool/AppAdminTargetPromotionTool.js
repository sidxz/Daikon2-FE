import { observer } from "mobx-react-lite";
import { Menu } from "primereact/menu";
import { Toast } from "primereact/toast";
import React, { useRef } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import AppAdminTargetPromotionToolDataManagement from "./AppAdminTargetPromotionToolDataManagement/AppAdminTargetPromotionToolDataManagement";
import AppAdminTargetPromotionToolQuestionnaireMeta from "./AppAdminTargetPromotionToolQuestionnaireMeta/AppAdminTargetPromotionToolQuestionnaireMeta";

const AppAdminTargetPromotionTool = () => {
  const toast = useRef(null);

  const navigate = useNavigate();

  const SideMenuItems = [
    {
      label: "Sections",
      items: [
        {
          label: "Promotion Questionnaire Meta",
          icon: "icon icon-common icon-cubes",
          command: () => {
            navigate("questionnaire-meta/");
          },
        },
        {
          label: "Data Management",
          icon: "icon icon-common icon-exchange-alt",
          command: () => {
            navigate("data-management/");
          },
        },
      ],
    },
  ];
  return (
    <React.Fragment>
      <Toast ref={toast} />
      <div className="flex gap-2 w-full">
        <div className="flex">
          <Menu model={SideMenuItems} />
        </div>
        <div className="flex w-full">
          <Routes>
            <Route
              index
              element={<Navigate replace to="questionnaire-meta/" />}
            />
            <Route
              path="questionnaire-meta/"
              element={<AppAdminTargetPromotionToolQuestionnaireMeta />}
            />
            <Route
              path="data-management/"
              element={<AppAdminTargetPromotionToolDataManagement />}
            />
          </Routes>
        </div>
      </div>
    </React.Fragment>
  );
};

export default observer(AppAdminTargetPromotionTool);
