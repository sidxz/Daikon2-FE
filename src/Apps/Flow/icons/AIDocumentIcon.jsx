import React from "react";
import IconSVG from "../../../assets/flow/aiDocument.svg";
import "./flowIcons.css";
export const AIDocumentIcon = ({ size, grayscale = 0 }) => {
  const width = size || "15px";
  const height = size || "15px";
  return (
    <div className="flex align-items-center ml-0 mr-2 p-0 mt-0 mb-0">
      <img
        src={IconSVG}
        className="flow-icon"
        width={width}
        height={height}
        style={{ filter: `grayscale(${grayscale})` }}
      />
    </div>
  );
};
