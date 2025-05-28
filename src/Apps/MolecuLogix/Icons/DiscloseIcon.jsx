import React from "react";
import DiscloseSVG from "../../../assets/moleculogix/disclose.svg";
import "./DiscloseIcon.css";
export const DiscloseIcon = ({ size }) => {
  const width = size || "24px";
  const height = size || "24px";
  return (
    <div className="flex align-items-center ml-1 mr-1">
      <img
        src={DiscloseSVG}
        className="disclose-icon"
        alt="Disclose"
        width={width}
        height={height}
      />
    </div>
  );
};
