import React from "react";
import IconSVG from "../../../assets/flow/project.svg";
import "./flowIcons.css";
export const ProjectIcon = ({ size, grayscale = 0 }) => {
  const width = size || "24px";
  const height = size || "24px";
  return (
    <div className="flex align-items-center ml-1 mr-1 p-0 mt-0 mb-0">
      <img
        src={IconSVG}
        className="flow-icon"
        alt="Portfolio"
        width={width}
        height={height}
        style={{ filter: `grayscale(${grayscale})` }}
      />
    </div>
  );
};
