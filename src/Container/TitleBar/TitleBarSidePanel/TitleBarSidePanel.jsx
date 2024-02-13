import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import React from "react";
import { useNavigate } from "react-router-dom";
import mainLogo from "../../../assets/logo-daikon.png";
import { appVersion } from "../../../constants/appVersion";

const TitleBarSidePanel = ({ toggle, user }) => {
  const navigate = useNavigate();

  const adminTools = (
    <div className="flex flex-column">
      <div className="flex">
        <div className="flex">
          {" "}
          <h4>+ Admin Tools</h4>
        </div>
        <div className="flex">
          {" "}
          <Divider type="dashed" />
        </div>
      </div>

      <div className="flex">
        <div className="card">
          <Button
            type="button"
            label="Admin Dashboard"
            icon="icon icon-common icon-asterisk"
            className="p-mr-2 p-mb-2 p-button-text p-button-plain p-button-sm"
            onClick={() => {
              toggle();
              setAppView("AdminDashboard");
              navigate("/admin");
            }}
          />
        </div>
      </div>
    </div>
  );

  const pmTools = (
    <div className="flex flex-column">
      <div className="flex">
        <div className="flex">
          {" "}
          <h4>+ Project Management</h4>
        </div>
        <div className="flex">
          {" "}
          <Divider type="dashed" />
        </div>
      </div>

      <div className="flex">
        <div className="card">
          <Button
            type="button"
            label="Project Management Dashboard"
            icon="icon icon-common icon-asterisk"
            className="p-mr-2 p-mb-2 p-button-text p-button-plain p-button-sm"
            onClick={() => {
              toggle();
              setAppView("ProjectManagement");
              navigate("/pm");
            }}
          />
        </div>
      </div>
    </div>
  );

  const tools = (
    <div className="flex flex-column">
      <div className="flex">
        <div className="flex">
          {" "}
          <h4>+ Tools</h4>
        </div>
        <div className="flex">
          {" "}
          <Divider type="dashed" />
        </div>
      </div>

      <div className="flex">
        <div className="card">
          <Button
            type="button"
            label="Compounds"
            icon="icon icon-common icon-asterisk"
            className="p-mr-2 p-mb-2 p-button-text p-button-plain p-button-sm"
            onClick={() => {
              toggle();
              setAppView("Tools");
              navigate("/tools");
            }}
          />
        </div>
      </div>
    </div>
  );

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

      <div className="flex align-items-center justify-content-center">
        {/* <div className="card p-fluid">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText placeholder="Search" />
          </span>
        </div> */}
      </div>

      {/* <div className="flex">
        {user.roles.includes("admin") ? adminTools : ""}
      </div>

      <div className="flex">
        {user.roles.includes("projectManager") ? pmTools : ""}
      </div>

      <div className="flex">
        {user.roles.includes("projectManager") ? tools : ""}
      </div> */}
    </div>
  );
};

export default observer(TitleBarSidePanel);
