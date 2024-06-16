import { NavLink } from "react-router-dom";
import MultiSelectFilter from "../../../../../Shared/TableFilters/MultiSelectFilter";
import { TargetIcon } from "../../../icons/TargetIcon";
import { FormatScreeningMethod } from "../../shared/Formatters";
import ScreenStatusDropdown from "../../shared/ScreenStatusDropdown";
export const rowGroupHeaderTemplate = (data) => {
  return (
    <div className="flex align-items-center gap-2 bg-gray-50 p-2 border-round-md">
      <TargetIcon size="16px" grayscale={0} />
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
