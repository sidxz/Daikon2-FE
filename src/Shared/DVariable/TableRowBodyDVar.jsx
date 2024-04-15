import React from "react";
import { AppOrgResolver } from "../VariableResolvers/AppOrgResolver";

const TableRowBodyDVar = ({ dVar, isOrg = false }) => {
  if (isOrg) {
    const { getOrgNameById } = AppOrgResolver();
    return <>{getOrgNameById(dVar?.value)}</>;
  }
  return <>{dVar?.value}</>;
};

export default TableRowBodyDVar;
