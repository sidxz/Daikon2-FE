import React from "react";
import { NavLink } from "react-router-dom";
import { AppOrgResolver } from "../VariableResolvers/AppOrgResolver";

const TableRowBodyDVar = ({
  dVar,
  isOrg = false,
  isLink = false,
  linkText = "Open",
}) => {
  if (isOrg) {
    const { getOrgNameById } = AppOrgResolver();
    return <>{getOrgNameById(dVar?.value)}</>;
  }
  if (isLink) {
    return (
      <NavLink to={dVar?.value} target="_blank" rel="noopener noreferrer">
        <div className="flex gap-2 align-items-center">
          <div className="flex">{linkText} </div>
          <div className="flex">
            <i className="pi pi-external-link"></i>
          </div>
        </div>
      </NavLink>
    );
  }

  return <>{dVar?.value}</>;
};

export default TableRowBodyDVar;
