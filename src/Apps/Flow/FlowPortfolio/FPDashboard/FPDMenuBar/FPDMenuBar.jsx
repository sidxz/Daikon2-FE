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
    if (location.pathname.includes("/overview/")) setActiveIndex(0);
    else if (location.pathname.includes("/all-portfolio-projects/"))
      setActiveIndex(1);
  }, [location, setActiveIndex]);

  const items = [
    {
      label: "Overview",
      command: () => navigate("overview/"),
    },
    {
      label: "All Portfolio Projects",
      command: () => navigate("all-portfolio-projects/"),
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
