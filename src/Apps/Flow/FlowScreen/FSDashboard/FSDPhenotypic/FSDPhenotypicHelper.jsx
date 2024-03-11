import { NavLink } from "react-router-dom";
import MultiSelectFilter from "../../../../../Shared/TableFilters/MultiSelectFilter";
import ScreenStatusDropdown from "../../shared/ScreenStatusDropdown";

export let nameBodyTemplate = (rowData) => {
  return <NavLink to={"../../viewer/ph/" + rowData.id}>{rowData.name}</NavLink>;
};

export let statusBodyTemplate = (rowData) => {
  return (
    <ScreenStatusDropdown readOnlyStatus={rowData.status} readOnly={true} />
  );
};

//Filter component for DataTable

export const screenStatusFilter = (data, options) => (
  <MultiSelectFilter data={data} filterProperty="status" options={options} />
);

export const orgFilter = (data, options) => (
  <MultiSelectFilter
    data={data}
    filterProperty="primaryOrgName"
    options={options}
  />
);
