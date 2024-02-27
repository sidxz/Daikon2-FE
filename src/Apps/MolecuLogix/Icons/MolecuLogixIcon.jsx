import React from "react";
import MolecuLogixSVG from "../../../assets/moleculogix/moleculogix.svg";
import "./MolecuLogixIcon.css";
export const MolecuLogixIcon = ({ size }) => {
  const width = size || "24px";
  const height = size || "24px";
  return (
    <div className="flex align-items-center ml-2 mr-2">
      <img
        src={MolecuLogixSVG}
        className="moleculogix-icon"
        alt="MolecuLogix"
        width={width}
        height={height}
      />
    </div>
  );
};
