import { TabMenu } from "primereact/tabmenu";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const FHaDMenuBar = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  let location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("/overview/")) setActiveIndex(0);
    else if (location.pathname.includes("/paused/")) setActiveIndex(1);
    else if (location.pathname.includes("/all-projects/")) setActiveIndex(2);
  }, [location, setActiveIndex]);

  const items = [
    {
      label: "Overview",
      command: () => navigate("overview/"),
    },
    {
      label: "Paused",
      command: () => navigate("paused/"),
    },
    {
      label: "All HA Projects",
      command: () => navigate("all-projects/"),
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

export default FHaDMenuBar;
