import { observer } from "mobx-react-lite";
import { Card } from "primereact/card";
import React from "react";
import MostRecentEvents from "../../../Events/MostRecentEvents/MostRecentEvents";

const FlowDashEventUpdates = () => {
  return (
    <div className="flex w-full surface-50 border-round m-0 p-0 gap-2">
      <Card className="w-full">
        <MostRecentEvents />
      </Card>
    </div>
  );
};

export default observer(FlowDashEventUpdates);
