import { TabMenu } from "primereact/tabmenu";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminMenuBar.css";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
const AdminMenuBar = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  let location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("/user-management/")) setActiveIndex(0);
    else if (location.pathname.includes("/api-management/")) setActiveIndex(1);
    else if (location.pathname.includes("/role-management/")) setActiveIndex(2);
  }, [location, setActiveIndex]);

  const items = [
    {
      label: "User Management",
      icon: "pi pi-fw pi-user-plus",
      command: () => navigate("user-management/"),
    },
    // {
    //   label: "API Management",
    //   icon: "pi pi-fw pi-cloud",
    //   command: () => navigate("api-management/"),
    // },
    // {
    //   label: "Role Management",
    //   icon: "pi pi-fw pi-users",
    //   command: () => navigate("role-management/"),
    // },

    // { label: "Clinical", icon: "icon icon-conceptual icon-proteins" },
  ];
  return (
    <div className="AdminMenuBar flex justify-content-center flex-wrap">
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

export default AdminMenuBar;
