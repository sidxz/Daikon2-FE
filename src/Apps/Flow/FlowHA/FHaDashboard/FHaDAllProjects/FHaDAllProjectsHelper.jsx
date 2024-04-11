import { NavLink } from "react-router-dom";
import MultiSelectFilter from "../../../../../Shared/TableFilters/MultiSelectFilter";
import { AppOrgResolver } from "../../../../../Shared/VariableResolvers/AppOrgResolver";

export let nameBodyTemplate = (rowData) => {
  return <NavLink to={"../../viewer/" + rowData.id}>{rowData.name}</NavLink>;
};

export let orgBodyTemplate = (rowData) => {
  const { getOrgNameById } = AppOrgResolver();
  return getOrgNameById(rowData.primaryOrgId);
};

export const haStatusFilter = (data, options) => (
  <MultiSelectFilter data={data} filterProperty="status" options={options} />
);

export const orgFilter = (data, options) => (
  <MultiSelectFilter
    data={data}
    filterProperty="primaryOrgName"
    options={options}
  />
);
