import { observer } from "mobx-react-lite";
import { Card } from "primereact/card";
import React from "react";
import MostRecentComments from "../../Comments/MostRecentComments/MostRecentComments";
import "./FlowDash.css";
import FlowDashCards from "./FlowDashCards/FlowDashCards";
import FlowDashMLogixSearch from "./FlowDashMLogixSearch/FlowDashMLogixSearch";
import FlowDashWhatsNew from "./FlowDashWhatsNew/FlowDashWhatsNew";
const FlowDash = () => {
  let generateCardTitle = (icon, title) => {
    return (
      <div
        className="flex justify-content-center p-0 gap-2"
        style={{ margin: "0px", marginBottom: "-10px" }}
      >
        <div
          className="flex p-0 m-0"
          style={{
            color: "#3c83bd",
          }}
        >
          <i className={icon} />
        </div>
        <div className="flex p-0 m-0">
          <h5
            style={{
              color: "#3c83bd",
              margin: "0px",
              padding: "0px",
            }}
          >
            {title}
          </h5>
        </div>
      </div>
    );
  };
  return (
    <div className="FlowDash bg-bluegray-50 flex flex-column align-items-center w-full">
      <div className="flex">
        <p className="HeaderText text-xl font-medium">
          Data Acquisition, Integration and Knowledge Capture Application
        </p>
      </div>
      <div className="flex">
        <FlowDashCards />
      </div>

      <div className="flex w-full gap-2 mt-4">
        <div className="flex flex-column w-full w-8 gap-2 p-1">
          <div className="flex flex-column">
            <Card
              title={generateCardTitle(
                "icon icon-common icon-math",
                "Molecule Search"
              )}
              className="w-full min-h-full"
            >
              <div className="flex w-full pt-1">
                <FlowDashMLogixSearch />
              </div>
            </Card>
          </div>
          <div className="flex flex-column">
            <Card
              title={generateCardTitle("ri-discuss-line", "Recent Discussions")}
              className="w-full min-h-full"
            >
              <div className="flex w-full pt-1">
                <MostRecentComments />
              </div>
            </Card>
          </div>
        </div>

        <div className="flex flex-column p-1 w-4">
          <Card
            title={generateCardTitle(
              "icon icon-common icon-newspaper",
              "What's New?"
            )}
            className="w-full min-h-full"
          >
            <FlowDashWhatsNew />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default observer(FlowDash);
