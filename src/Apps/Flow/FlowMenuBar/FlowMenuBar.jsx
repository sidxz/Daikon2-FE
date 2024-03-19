import { TabMenu } from "primereact/tabmenu";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FlowMenuBar.css";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { GeneIcon } from "../icons/GeneIcon";
import { HAIcon } from "../icons/HAIcon";
import { PortfolioIcon } from "../icons/PortfolioIcon";
import { PostPortfolioIcon } from "../icons/PostPortfolioIcon";
import { ScreenIcon } from "../icons/ScreenIcon";
import { TargetIcon } from "../icons/TargetIcon";
const FlowMenuBar = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  let location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("/gene/")) setActiveIndex(0);
    else if (location.pathname.includes("/target/")) setActiveIndex(1);
    else if (location.pathname.includes("/screen/")) setActiveIndex(2);
    else if (location.pathname.includes("/ha/")) setActiveIndex(3);
    else if (location.pathname.includes("/portfolio/")) setActiveIndex(4);
    else if (location.pathname.includes("/post-portfolio/")) setActiveIndex(5);
  }, [location, setActiveIndex]);

  const items = [
    {
      label: "Genes",
      icon: <GeneIcon size={"30em"} />,
      command: () => navigate("gene/"),
    },
    {
      label: "Targets",
      icon: <TargetIcon size={"25em"} />,
      command: () => navigate("target/"),
    },
    {
      label: "Screens",
      icon: <ScreenIcon size={"25em"} />,
      command: () => navigate("screen/"),
    },
    {
      label: "Hit Assessment",
      icon: <HAIcon size={"30em"} />,
      command: () => navigate("ha/"),
    },
    {
      label: "Portfolio",
      icon: <PortfolioIcon size={"25em"} />,
      command: () => navigate("portfolio/"),
    },

    {
      label: "Post-Portfolio",
      icon: <PostPortfolioIcon size={"25em"} />,
      command: () => navigate("post-portfolio/"),
    },

    // { label: "Clinical", icon: "icon icon-conceptual icon-proteins" },
  ];
  return (
    <div className="FlowMenuBar flex justify-content-center flex-wrap">
      <div className="flex pipeline-menu scalein animation-duration-500">
        <TabMenu
          model={items}
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
        />
      </div>
    </div>
  );
};

export default FlowMenuBar;
