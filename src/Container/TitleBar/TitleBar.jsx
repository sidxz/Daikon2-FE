import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { OverlayPanel } from "primereact/overlaypanel";
import { Sidebar } from "primereact/sidebar";
import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RootStoreContext } from "../../RootStore";
import { MenuIcon } from "../icons/MenuIcon";
import "./TitleBar.css";
import TitleBarAccountPanel from "./TitleBarAccountPanel/TitleBarAccountPanel";
import TitleBarSidePanel from "./TitleBarSidePanel/TitleBarSidePanel";

const TitleBar = ({ signOut, ssoUser }) => {
  const navigate = useNavigate();

  const op = useRef(null);
  const [showSidePanel, setShowSidePanel] = useState(false);
  const rootStore = useContext(RootStoreContext);
  const { user } = rootStore.authStore;

  const Strains = [{ name: "Mycobacterium tuberculosis H37Rv", code: "H37Rv" }];
  const FeedbackOptions = [
    {
      label: "Bug Report",
      value: "bug-report",
      command: () => navigate("bug-report/"),
    },
    {
      label: "Feature Request",
      value: "feature-request",
      command: () => navigate("feature-request/"),
    },
    {
      label: "Data Discrepancy ",
      value: "data-discrepancy",
      command: () => navigate("data-discrepancy/"),
    },
  ];

  const feedbackOptionTemplate = (option) => {
    const iconClass = (option) => {
      switch (option.value) {
        case "bug-report":
          return "icon icon-common icon-bug";
        case "feature-request":
          return "icon icon-common icon-new";
        case "data-discrepancy":
          return "icon icon-common icon-database";
      }
    };

    return (
      <div className="flex gap-3">
        <i className={iconClass(option)} />
        <div>{option.label}</div>
      </div>
    );
  };

  let onFeedback = (e) => {
    navigate("/support/" + e.value);
  };

  return (
    <>
      <div className="TitleBar w-full ">
        <div className="Header flex w-full">
          <div className="flex flex-row flex-wrap w-3">
            <div className="flex align-items-center justify-content-center">
              <Button
                type="Button"
                icon={<MenuIcon size={"20em"} />}
                className="BlackButton"
                onClick={() => setShowSidePanel(true)}
              />
            </div>
            <div className="flex align-items-center justify-content-center ml-2">
              <Button
                className="BlackButton text-2xl p-0 pl-1 pr-1 mr-1 ml-1 font-semibold fadein animation-duration-1000"
                onClick={() => navigate("/")}
              >
                D A I K O N
              </Button>
            </div>
          </div>

          <div className="flex flex-row-reverse flex-wrap gap-2 w-9">
            <div className="flex align-items-center justify-content-center mr-3">
              <Button
                type="Button"
                className="BlackButton"
                icon="ri-user-line"
                label={user.email}
                onClick={(e) => op.current.toggle(e)}
              />
              <OverlayPanel dismissable ref={op}>
                <TitleBarAccountPanel signOut={() => signOut()} />
              </OverlayPanel>
            </div>
            <div className="flex align-items-center justify-content-center ">
              <Dropdown
                className="BlackButton"
                options={FeedbackOptions}
                onChange={(e) => onFeedback(e)}
                optionLabel="label"
                placeholder="Support"
                itemTemplate={feedbackOptionTemplate}
              />
            </div>

            <div className="flex align-items-center justify-content-center ">
              <Dropdown
                className="BlackButton"
                value={"Mycobacterium tuberculosis H37Rv"}
                options={Strains}
                // onChange={onCityChange}
                optionLabel="name"
                placeholder="H37Rv"
              />
            </div>
            <div className="flex align-items-center justify-content-center ">
              <Button
                type="Button"
                className="BlackButton"
                icon="ri-refresh-line"
                label="Sync"
                onClick={() => window.location.reload()}
              />
            </div>
          </div>
        </div>
      </div>
      <Sidebar
        visible={showSidePanel}
        baseZIndex={1000000}
        onHide={() => setShowSidePanel(false)}
      >
        <TitleBarSidePanel toggle={() => setShowSidePanel(false)} user={user} />
      </Sidebar>
    </>
  );
};

export default observer(TitleBar);
