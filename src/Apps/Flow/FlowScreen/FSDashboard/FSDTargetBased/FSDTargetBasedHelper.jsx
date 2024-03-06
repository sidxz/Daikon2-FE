import { NavLink } from "react-router-dom";
import MultiSelectFilter from "../../../../../Shared/TableFilters/MultiSelectFilter";
import { FormatScreeningMethod } from "../../shared/Formatters";
import ScreenStatusDropdown from "../../shared/ScreenStatusDropdown";
export const rowGroupHeaderTemplate = (data) => {
  return (
    <div className="flex align-items-center gap-2">
      <i className="icon icon-common icon-target"></i>
      <span className="font-bold">{data.associatedTargetsFlattened}</span>
    </div>
  );
};

export let nameBodyTemplate = (rowData) => {
  return <NavLink to={"../../viewer/tb/" + rowData.id}>{rowData.name}</NavLink>;
};

export let statusBodyTemplate = (rowData) => {
  return (
    <ScreenStatusDropdown readOnlyStatus={rowData.status} readOnly={true} />
  );
};

//Filter component for DataTable

export const methodFilter = (data, options) => (
  <MultiSelectFilter
    data={data}
    filterProperty="method"
    options={options}
    labelMapper={FormatScreeningMethod}
  />
);

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
