import { observer } from "mobx-react-lite";
import React from "react";
import { NavLink } from "react-router-dom";
import FlowDashCardsCircles from "./FlowDashCardsCircles/FlowDashCardsCircles";

const FlowDashCards = () => {
  return (
    <div className="flex justify-content-center gap-5 mt-2 ">
      {" "}
      <div className="flex">
        <NavLink to="gene/" style={{ textDecoration: "None" }}>
          <FlowDashCardsCircles
            icon="icon icon-conceptual icon-dna"
            total="4173"
          />
        </NavLink>
      </div>
      <div className="flex">
        <NavLink to="target/" style={{ textDecoration: "None" }}>
          <FlowDashCardsCircles
            icon="icon icon-common icon-target"
            total="105"
          />
        </NavLink>
      </div>
      <div className="flex">
        <NavLink to="screen/" style={{ textDecoration: "None" }}>
          <FlowDashCardsCircles
            icon="icon icon-common icon-search"
            total="105"
          />
        </NavLink>
      </div>
    </div>
  );
};

export default observer(FlowDashCards);
