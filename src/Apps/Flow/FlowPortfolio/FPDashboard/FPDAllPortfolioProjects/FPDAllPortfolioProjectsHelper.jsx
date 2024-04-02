import { NavLink } from "react-router-dom";
import MultiSelectFilter from "../../../../../Shared/TableFilters/MultiSelectFilter";

export let nameBodyTemplate = (rowData) => {
  return <NavLink to={"../../viewer/" + rowData.id}>{rowData.name}</NavLink>;
};

export const projectStatusFilter = (data, options) => (
  <MultiSelectFilter data={data} filterProperty="status" options={options} />
);

export const orgFilter = (data, options) => (
  <MultiSelectFilter
    data={data}
    filterProperty="primaryOrgName"
    options={options}
  />
);
