import React from "react";
import IconSVG from "../../assets/title/menu.svg";
import "./titleIcons.css";
export const MenuIcon = ({ size }) => {
  const width = size || "24px";
  const height = size || "24px";
  return (
    <div className="flex align-items-center ml-1 mr-1 p-0 mt-0 mb-0">
      <img
        src={IconSVG}
        className="title-icon"
        alt="Menu"
        width={width}
        height={height}
      />
    </div>
  );
};
