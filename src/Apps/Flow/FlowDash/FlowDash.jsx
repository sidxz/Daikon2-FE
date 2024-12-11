import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import React from "react";
import "./FlowDash.css";
import FlowDashCards from "./FlowDashCards/FlowDashCards";
import FlowDashMostRecentComments from "./FlowDashComments/FlowDashMostRecentComments";
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
    <div className="flex flex-column align-items-center w-full">
      <div className="FlowDash bg-bluegray-50 flex flex-column align-items-center w-full border-round-xl">
        <div className="flex flex-column align-items-center w-full border-round-md border-black-alpha-30">
          <div className="flex">
            <p className="HeaderText text-2xl font-medium">
              Data Acquisition, Integration and Knowledge Capture Application
            </p>
          </div>
          <div className="flex mb-3">
            <FlowDashCards />
          </div>
        </div>
      </div>

      <div className="flex mt-2 w-full gap-2 border-round-xl">
        <div className="flex border-round-lg shadow-1 flex-column w-3 gap-1 p-2 mb-2">
          <div className="flex flex-column">
            <p className="text-2xl mt-1 ml-3 font-bold text-gray-700 text-left">
              Latest Discussions
            </p>
            <div className="flex w-full hover:shadow-1 ">
              <FlowDashMostRecentComments />
            </div>
            {/* </Card> */}
          </div>
        </div>

        <div className="flex shadow-1 border-round-lg w-full w-7 gap-2">
          <FlowDashEventUpdates />
        </div>

        <div className="flex flex-column w-3 gap-2">
          <div className="flex bg-bluegray-50 flex-column border-round-lg">
            <p className="text-2xl mt-2 ml-3 font-bold text-gray-700 text-left ">
              MolecuLogix
            </p>

            <div className="flex w-full">
              <FlowDashMLogixSearch />
            </div>
          </div>

          <div className="flex flex-column shadow-1 border-round-lg">
            <div className="flex text-2xl mt-2 ml-3 font-bold text-gray-700 text-left">
              What's New
            </div>
            <div className="flex w-full">
              <FlowDashWhatsNew />
            </div>
          </div>

          <div className="flex flex-column shadow-1 hover:shadow-1 border-round-lg">
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
                  label="DAIKON Paper"
                  className="p-button-info p-button-md"
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
