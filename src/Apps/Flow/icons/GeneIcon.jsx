import React from "react";
import IconSVG from "../../../assets/flow/gene.svg";
import "./flowIcons.css";
export const GeneIcon = ({ size }) => {
  const width = size || "24px";
  const height = size || "24px";
  return (
    <div className="flex align-items-center ml-1 mr-1 p-0 mt-0 mb-0">
      <img
        src={IconSVG}
        className="flow-icon"
        alt="Gene"
        width={width}
        height={height}
      />
    </div>
  );
};
