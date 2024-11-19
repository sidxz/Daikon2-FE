import { observer } from "mobx-react-lite";
import { Card } from "primereact/card";
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
    <div className="flex w-full surface-50 border-round m-0 p-0 gap-2">
      <Card
        className="w-full"
        title={cardTitle("icon icon-common icon-clock", "Activity Feed")}
      >
        <MostRecentEvents ref={mostRecentEventsRef} />
      </Card>
    </div>
  );
};

export default observer(FlowDashEventUpdates);
