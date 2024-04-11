import { observer } from "mobx-react-lite";
import React from "react";
import { NavLink } from "react-router-dom";
import { GeneIcon } from "../../icons/GeneIcon";
import { HAIcon } from "../../icons/HAIcon";
import { PortfolioIcon } from "../../icons/PortfolioIcon";
import { PostPortfolioIcon } from "../../icons/PostPortfolioIcon";
import { ScreenIcon } from "../../icons/ScreenIcon";
import { TargetIcon } from "../../icons/TargetIcon";
import FlowDashCardsCircles from "./FlowDashCardsCircles/FlowDashCardsCircles";

const FlowDashCards = () => {
  return (
    <div className="flex justify-content-center gap-5 mt-2 ">
      {" "}
      <div className="flex">
        <NavLink to="gene/" style={{ textDecoration: "None" }}>
          <FlowDashCardsCircles
            svgIcon={<GeneIcon size={"25em"} />}
            total="4173"
          />
        </NavLink>
      </div>
      <div className="flex">
        <NavLink to="target/" style={{ textDecoration: "None" }}>
          <FlowDashCardsCircles
            // icon="icon icon-common icon-target"
            svgIcon={<TargetIcon size={"25em"} />}
            total="105"
          />
        </NavLink>
      </div>
      <div className="flex">
        <NavLink to="screen/" style={{ textDecoration: "None" }}>
          <FlowDashCardsCircles
            // icon="icon icon-common icon-search"
            svgIcon={<ScreenIcon size={"25em"} />}
            total="105"
          />
        </NavLink>
      </div>
      <div className="flex">
        <NavLink to="screen/" style={{ textDecoration: "None" }}>
          <FlowDashCardsCircles
            //  icon="icon icon-common icon-search"
            svgIcon={<HAIcon size={"25em"} />}
            total="105"
          />
        </NavLink>
      </div>
      <div className="flex">
        <NavLink to="screen/" style={{ textDecoration: "None" }}>
          <FlowDashCardsCircles
            // icon="icon icon-common icon-search"
            svgIcon={<PortfolioIcon size={"25em"} />}
            total="105"
          />
        </NavLink>
      </div>
      <div className="flex">
        <NavLink to="screen/" style={{ textDecoration: "None" }}>
          <FlowDashCardsCircles
            // icon="icon icon-common icon-search"
            svgIcon={<PostPortfolioIcon size={"25em"} />}
            total="105"
          />
        </NavLink>
      </div>
    </div>
  );
};

export default observer(FlowDashCards);
