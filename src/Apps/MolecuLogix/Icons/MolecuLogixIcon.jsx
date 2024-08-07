import React from "react";
import MolecuLogixSVG from "../../../assets/moleculogix/moleculogix2.svg";
import "./MolecuLogixIcon.css";
export const MolecuLogixIcon = ({ size }) => {
  const width = size || "24px";
  const height = size || "24px";
  return (
    <div className="flex align-items-center ml-1 mr-1">
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
