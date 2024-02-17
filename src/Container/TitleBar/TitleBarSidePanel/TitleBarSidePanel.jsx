import { observer } from "mobx-react-lite";
import { Divider } from "primereact/divider";
import { PanelMenu } from "primereact/panelmenu";
import React from "react";
import { useNavigate } from "react-router-dom";
import { MolecuLogixIcon } from "../../../Apps/MolecuLogix/Icons/MolecuLogixIcon";
import mainLogo from "../../../assets/logo-daikon.png";
import { appVersion } from "../../../constants/appVersion";

const TitleBarSidePanel = ({ toggle, user }) => {
  const navigate = useNavigate();

  const items = [
    {
      label: "Admin",
      icon: "pi pi-fw pi-cog",
      items: [
        {
          label: "User Management",
          icon: "pi pi-fw pi-user-plus",
          command: () => {
            navigate("/admin/users");
            toggle();
          },
        },
        {
          label: "API Management",
          icon: "pi pi-fw pi-cloud",
          command: () => {
            navigate("/admin/apis");
            toggle();
          },
        },
        {
          label: "Role Management",
          icon: "pi pi-fw pi-users",
          command: () => {
            navigate("/admin/users");
            toggle();
          },
        },
      ],
    },
    {
      label: "MolecuLogix",
      icon: <MolecuLogixIcon size={"18em"} />,
      command: () => {
        navigate("/moleculogix");
        toggle();
      },
    },
  ];

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
