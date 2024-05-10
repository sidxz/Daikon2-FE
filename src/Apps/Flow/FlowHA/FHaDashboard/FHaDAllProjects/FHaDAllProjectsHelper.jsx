import { MultiSelect } from "primereact/multiselect";
import { NavLink } from "react-router-dom";
import MultiSelectFilter from "../../../../../Shared/TableFilters/MultiSelectFilter";
import { AppOrgResolver } from "../../../../../Shared/VariableResolvers/AppOrgResolver";
import { statusOptions } from "../../constants/statusOptions";
import HaStatusDropdown from "../../shared/HaStatusDropdown";

export let nameBodyTemplate = (rowData) => {
  return <NavLink to={"../../viewer/" + rowData.id}>{rowData.name}</NavLink>;
};

export let orgBodyTemplate = (rowData) => {
  const { getOrgAliasById } = AppOrgResolver();
  return getOrgAliasById(rowData.primaryOrgId);
};

export const statusBodyTemplate = (rowData) => {
  return <HaStatusDropdown readOnlyStatus={rowData.status} readOnly={true} />;
};

export const haStatusFilter = (data, options) => (
  <MultiSelectFilter data={data} filterProperty="status" options={options} />
);

export const orgFilter = (data, options) => {
  const { getOrgAliasById } = AppOrgResolver();
  return (
    <MultiSelectFilter
      data={data}
      filterProperty="primaryOrgId"
      options={options}
      labelMapper={getOrgAliasById}
    />
  );
};

export const statusFilter = (data, options) => (
  <MultiSelect
    value={options.value}
    optionLabel="name"
    optionValue="value"
    itemTemplate={(option) => (
      <div className="flex align-items-center gap-2">
        <div className="flex flex-column">{option.icon}</div>
        <div className="flex flex-column">{option.name}</div>
      </div>
    )}
    options={statusOptions}
    onChange={(e) => options.filterApplyCallback(e.value)}
    className="p-column-filter"
    showClear
  />
);
