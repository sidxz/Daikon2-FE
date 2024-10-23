import { observer } from "mobx-react-lite";
import { Card } from "primereact/card";
import React from "react";
import MostRecentEvents from "../../../Events/MostRecentEvents/MostRecentEvents";

const FlowDashEventUpdates = () => {
  let cardTitle = (icon, text) => (
    <div
      className="flex justify-content-center m-0 p-0"
      style={{ margin: "0px", marginBottom: "-10px" }}
    >
      <div className="flex p-1  mr-1 text-cyan-700 text-2xl">
        <i className={icon} />
      </div>
      <div className="m-0 p-0 text-cyan-700 text-2xl">{text}</div>
    </div>
  );

  return (
    <div className="flex w-full surface-50 border-round m-0 p-0 gap-2">
      <Card
        className="w-full"
        title={cardTitle("icon icon-common icon-clock", "Recent Activity")}
      >
        <MostRecentEvents />
      </Card>
    </div>
  );
};

export default observer(FlowDashEventUpdates);