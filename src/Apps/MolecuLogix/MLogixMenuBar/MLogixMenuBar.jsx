import { TabMenu } from "primereact/tabmenu";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./MLogixMenuBar.css";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { DiscloseIcon } from "../Icons/DiscloseIcon";
import { MolecuLogixIcon } from "../Icons/MolecuLogixIcon";
const MLogixMenuBar = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  let location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("/moleculogix/search")) {
      setActiveIndex(2);
    } else if (location.pathname.includes("/disclosure-report")) {
      setActiveIndex(4);
    } else if (location.pathname.includes("/disclose")) {
      setActiveIndex(3);
    } else if (location.pathname.includes("/moleculogix")) {
      setActiveIndex(1); // Assuming index 1 corresponds to "MolecuLogix", adjusted from 0
    } else {
    }
  }, [location]);

  const items = [
    {
      label: "Home",
      icon: "icon icon-common icon-arrow-left",
      command: () => navigate("/wf/"),
    },

    {
      label: "MolecuLogix",
      icon: <MolecuLogixIcon />,
      command: () => navigate("/moleculogix"),
      separator: true,
    },

    {
      label: "Search",
      icon: "icon icon-common icon-search",
      command: () => navigate("search/"),
    },
    {
      label: "Disclose",
      icon: <DiscloseIcon />,
      command: () => navigate("disclose/"),
    },
    {
      label: "Disclosure Report",
      icon: <DiscloseIcon />,
      command: () => navigate("disclosure-report/"),
    },
    // {
    //   label: "All Molecules",
    //   icon: "icon icon-common icon-search",
    //   command: () => navigate("all/"),
    // },
    // {
    //   label: "Draw",
    //   icon: "icon icon-conceptual icon-chemical",
    //   command: () => navigate("draw/"),
    // },

    // { label: "Clinical", icon: "icon icon-conceptual icon-proteins" },
  ];
  return (
    <div className="FlowMenuBar flex justify-content-center flex-wrap">
      <div className="flex pipeline-menu scalein animation-duration-500">
        <TabMenu
          model={items}
          activeIndex={activeIndex}
          onTabChange={(e) => {
            setActiveIndex(e.index);
          }}
        />
      </div>
    </div>
  );
};

export default MLogixMenuBar;
