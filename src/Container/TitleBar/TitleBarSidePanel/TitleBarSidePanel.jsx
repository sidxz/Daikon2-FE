import { observer } from "mobx-react-lite";
import { Divider } from "primereact/divider";
import { PanelMenu } from "primereact/panelmenu";
import React from "react";
import { useNavigate } from "react-router-dom";
import { AdminIcon } from "../../../Apps/Admin/icons/AdminIcon";
import { MolecuLogixIcon } from "../../../Apps/MolecuLogix/Icons/MolecuLogixIcon";
import { QuestionnaireIcon } from "../../../Apps/Questionnaire/icons/QuestionnaireIcon";
import { AppRoleResolver } from "../../../Shared/VariableResolvers/AppRoleResolver";
import mainLogo from "../../../assets/logo-daikon.png";
import { appVersion } from "../../../constants/appVersion";
import "./TitleBarSidePanel.css";
const TitleBarSidePanel = ({ toggle, user }) => {
  const navigate = useNavigate();
  const { isUserInAnyOfRoles } = AppRoleResolver();

  const items = [
    {
      label: "MolecuLogix",
      icon: <MolecuLogixIcon size={"18em"} />,
      command: () => {
        navigate("/moleculogix");
        toggle();
      },
    },
  ];

  if (isUserInAnyOfRoles(["APP-ADMIN"])) {
    items.push({
      label: "Admin",
      icon: <AdminIcon size={"18em"} />,
      items: [
        {
          label: "User Management",
          icon: "pi pi-fw pi-user-plus",
          command: () => {
            navigate("/admin/user-management/users");
            toggle();
          },
        },
        {
          label: "Role Management",
          icon: "pi pi-fw pi-users",
          command: () => {
            navigate("/admin/role-management");
            toggle();
          },
        },
      ],
    });

    items.push({
      label: "Questionnaires",
      icon: <QuestionnaireIcon size={"18em"} />,
      command: () => {
        navigate("/questionnaire");
        toggle();
      },
    });
  }

  return (
    <div className="flex flex-column">
      <div className="flex align-items-center justify-content-center">
        <div style={{ lineHeight: "0.1", padding: "20px" }}>
          {/* <h2 className={cssClass.Colorized}>D A I K O N</h2> */}
          <img src={mainLogo} width="180" />
          <p style={{ textAlign: "center" }}>
            {appVersion.stream} {appVersion.release} {appVersion.channel}
          </p>
        </div>
      </div>
      <Divider />

      <div className="card flex justify-content-center">
        <PanelMenu model={items} className="w-full md:w-20rem" multiple />
      </div>
    </div>
  );
};

export default observer(TitleBarSidePanel);
