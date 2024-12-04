import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import React, { useRef } from "react";
import MostRecentEvents from "../../../Events/MostRecentEvents/MostRecentEvents";

const FlowDashEventUpdates = () => {
  const mostRecentEventsRef = useRef();

  const handleRefreshClick = () => {
    mostRecentEventsRef.current.refreshEvents();
  };

  const cardTitle = (icon, text) => (
    <div className="flex flex-column w-full border-0">
      {/* <div
        className="justify-content-end flex m-0 p-0 text-cyan-700 text-sm pl-3 align-items-center"
        onClick={handleRefreshClick}
        style={{ cursor: "pointer" }}
      >
        Refresh
      </div> */}
      <div
        className="flex justify-content-center m-0 p-0 border-0"
        style={{ margin: "0px", marginBottom: "-10px" }}
      >
        <div
          className="flex p-1 mr-1 text-cyan-700 text-2xl cursor-pointer"
          onClick={handleRefreshClick}
        >
          <i className={icon} />
        </div>
        <div className="flex m-0 p-0 text-cyan-700 text-2xl">{text}</div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-column w-full m-0 p-0 gap-2">
      <div className="flex flex-column w-full">
        <div className="flex ">
          <div className="flex justify-content-start w-full">
            <div className="flex">
              <p className="flex text-2xl mt-0 mb-1 mt-2 ml-3 font-bold text-gray-700 text-left">
                Activity Feed
              </p>
            </div>
          </div>
          <div className="flex w-full justify-content-end align-items-end mb-1 mr-2 mt-2 gap-2 border-round-md">
            <div className="flex">
              <Button icon="pi pi-filter-fill" />
            </div>
            <div className="flex">
              <Button icon="pi pi-file-export" />
            </div>
          </div>
        </div>

        <div className="p-3 border-round-md border-black-alpha-30">
          <MostRecentEvents ref={mostRecentEventsRef} />
        </div>
      </div>
    </div>
  );
};

export default observer(FlowDashEventUpdates);
