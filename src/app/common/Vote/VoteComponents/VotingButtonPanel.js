import { Button } from "primereact/button";
import React from "react";

const VotingButtonPanel = ({ castVote, loading }) => {
  return (
    <div
      className="flex justify-content-center border-1 border-200"
      style={{ width: "10rem" }}
    >
      <div className="flex">
        <Button
          icon="icon icon-common icon-thumbs-up"
          className="p-button-rounded p-button-text p-button-lg"
          tooltip="Vote Positive"
          tooltipOptions={{ position: "bottom" }}
          style={{ color: "#76D7C4" }}
          loading={loading}
          onClick={(e) => castVote(e, "Positive")}
        />
      </div>
      <div className="flex">
        <Button
          icon="icon icon-common icon-hand-rock"
          className="p-button-rounded p-button-text p-button-lg"
          tooltip="Vote Neutral"
          tooltipOptions={{ position: "bottom" }}
          style={{ color: "#F7DC6F" }}
          onClick={(e) => castVote(e, "Neutral")}
          loading={loading}
        />
      </div>
      <div className="flex">
        <Button
          icon="icon icon-common icon-thumbs-down"
          className="p-button-rounded p-button-text p-button-lg"
          tooltip="Vote Negative"
          tooltipOptions={{ position: "bottom" }}
          style={{ color: "#F1948A" }}
          onClick={(e) => castVote(e, "Negative")}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default VotingButtonPanel;
