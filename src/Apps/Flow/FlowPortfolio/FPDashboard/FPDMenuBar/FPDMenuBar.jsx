import { TabMenu } from "primereact/tabmenu";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const FPDMenuBar = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  let location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("/high-priority/")) setActiveIndex(0);
    else if (location.pathname.includes("/at-risk/")) setActiveIndex(1);
    else if (location.pathname.includes("/all-portfolio/")) setActiveIndex(2);
    else if (location.pathname.includes("/tabular-view/")) setActiveIndex(3);
  }, [location, setActiveIndex]);

  const items = [
    {
      label: "Overview",
      command: () => navigate("overview/"),
    },
    {
      label: "High Priority",
      command: () => navigate("high-priority/"),
    },
    {
      label: "At Risk",
      command: () => navigate("at-risk/"),
    },
    {
      label: "All Portfolio",
      command: () => navigate("all-portfolio/"),
    },
    {
      label: "Tabular View",
      command: () => navigate("tabular-view/"),
    },
  ];

  return (
    <div className="flex justify-content-center w-full animation-duration-500">
      <TabMenu
        className="w-full"
        model={items}
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      />
    </div>
  );
};

export default FPDMenuBar;
