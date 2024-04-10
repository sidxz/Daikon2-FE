import { NavLink } from "react-router-dom";
import MultiSelectFilter from "../../../../../Shared/TableFilters/MultiSelectFilter";
import { AppOrgResolver } from "../../../../../Shared/VariableResolvers/AppOrgResolver";
import PortfolioStageDropdown from "../../shared/PortfolioStageDropdown";

export let nameBodyTemplate = (rowData) => {
  return <NavLink to={"../../viewer/" + rowData.id}>{rowData.name}</NavLink>;
};

export let orgBodyTemplate = (rowData) => {
  const { getOrgNameById } = AppOrgResolver();
  return getOrgNameById(rowData.primaryOrgId);
};

export const projectStageFilter = (data, options) => (
  <MultiSelectFilter data={data} filterProperty="stage" options={options} />
);

export const orgFilter = (data, options) => (
  <MultiSelectFilter
    data={data}
    filterProperty="primaryOrgName"
    options={options}
  />
);

export let stageBodyTemplate = (rowData) => {
  return (
    <PortfolioStageDropdown readOnlyStatus={rowData.stage} readOnly={true} />
  );
};
