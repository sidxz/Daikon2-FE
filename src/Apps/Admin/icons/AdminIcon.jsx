import React from "react";
import AdminSVG from "../../../assets/admin/admin.svg";
import "./AdminIcon.css";
export const AdminIcon = ({ size }) => {
  const width = size || "24px";
  const height = size || "24px";
  return (
    <div className="flex align-items-center ml-2 mr-2">
      <img
        src={AdminSVG}
        className="adminIcon"
        alt="Admin"
        width={width}
        height={height}
      />
    </div>
  );
};
