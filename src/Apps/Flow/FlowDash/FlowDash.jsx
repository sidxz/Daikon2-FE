import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import React from "react";
import MostRecentComments from "../../Comments/MostRecentComments/MostRecentComments";
import "./FlowDash.css";
import FlowDashCards from "./FlowDashCards/FlowDashCards";
import FlowDashEventUpdates from "./FlowDashEventUpdates/FlowDashEventUpdates";
import FlowDashMLogixSearch from "./FlowDashMLogixSearch/FlowDashMLogixSearch";
import FlowDashWhatsNew from "./FlowDashWhatsNew/FlowDashWhatsNew";
const FlowDash = () => {
  let generateCardTitle = (icon, title) => {
    return (
      <div
        className="flex justify-content-center p-0 gap-2"
        style={{ margin: "0px", marginBottom: "-10px" }}
      >
        <div className="flex p-0 m-0 text-cyan-700 text-2xl">
          <i className={icon} />
        </div>
        <div className="flex p-0 m-0 text-cyan-700 text-2xl">{title}</div>
      </div>
    );
  };
  return (
    <div className="FlowDash bg-bluegray-50 flex flex-column align-items-center w-full">
      <div className="flex flex-column align-items-center w-full border-round-md border-black-alpha-30">
        <div className="flex">
          <p className="HeaderText text-xl font-medium">
            Data Acquisition, Integration and Knowledge Capture Application
          </p>
        </div>
        <div className="flex mb-3">
          <FlowDashCards />
        </div>
      </div>

      <div className="flex w-full gap-4 p-2">
        <div className="flex surface-0 shadow-1 hover:shadow-3 border-round-lg flex-column w-4 gap-1 p-1 mb-2">
          <div className="flex flex-column">
            <p className="text-2xl mt-2 ml-3 font-bold text-gray-700 text-left">
              Latest Discussions
            </p>
            {/* <Card
              title={generateCardTitle("ri-discuss-line", "Latest Discussions")}
              className="w-full min-h-full"
            > */}
            <div className="flex w-full pt-1">
              <MostRecentComments />
            </div>
            {/* </Card> */}
          </div>
        </div>

        <div className="flex surface-0 shadow-1 hover:shadow-3 border-round-lg w-full w-7 gap-2">
          <div className="flex">
            <FlowDashEventUpdates />
          </div>
        </div>

        <div className="flex bg-bluegray-50 flex-column w-3 gap-4">
          <div className="flex flex-column surface-0 shadow-1 hover:shadow-3 border-round-lg">
            <p className="text-2xl mt-2 ml-3 font-bold text-gray-700 text-left ">
              MolecuLogix
            </p>

            <div className="flex w-full">
              <FlowDashMLogixSearch />
            </div>
          </div>

          <div className="flex flex-column surface-0 shadow-1 hover:shadow-3 border-round-lg">
            <p className="text-2xl mt-2 ml-3 font-bold text-gray-700 text-left ">
              What's New
            </p>
            <p className="text-xl ml-3 font-bold text-gray-700 text-left ">
              DAIKON 2.0
            </p>
            <div className="flex w-full">
              <FlowDashWhatsNew />
            </div>
          </div>

          <div className="flex flex-column surface-0 shadow-1 hover:shadow-3 border-round-lg">
            <p className="text-2xl mt-1 ml-3 font-bold text-gray-700 text-left">
              Publications
            </p>
            <p className="mt-1 ml-3 ">
              We kindly request all users to <b>cite our work</b> when
              referencing our app. Thank you for your support!
            </p>
            <div className="flex flex-column align-items-center justify-content-center m-2">
              <div className="flex text-base justify-content-center justify-content-left"></div>
              <div className="flex mb-3">
                <Button
                  label=" DAIKON Paper"
                  className="p-button-info p-button-sm"
                  onClick={() =>
                    window.open(
                      "https://pubs.acs.org/doi/10.1021/acsptsci.3c00034"
                    )
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(FlowDash);
