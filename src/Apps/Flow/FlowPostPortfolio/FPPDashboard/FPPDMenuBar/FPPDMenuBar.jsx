import { TabMenu } from "primereact/tabmenu";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const FPPDMenuBar = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  let location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("/overview/")) setActiveIndex(0);
    else if (location.pathname.includes("/all-post-portfolio-projects/"))
      setActiveIndex(1);
  }, [location, setActiveIndex]);

  const items = [
    {
      label: "Overview",
      command: () => navigate("overview/"),
    },
    {
      label: "All Post Portfolio Projects",
      command: () => navigate("all-post-portfolio-projects/"),
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

export default FPPDMenuBar;
