import { MultiSelect } from "primereact/multiselect";
import { NavLink } from "react-router-dom";
import FDate from "../../../../../Library/FDate/FDate";
import MultiSelectFilter from "../../../../../Shared/TableFilters/MultiSelectFilter";
import { AppOrgResolver } from "../../../../../Shared/VariableResolvers/AppOrgResolver";
import PortfolioStageDropdown from "../../shared/PortfolioStageDropdown";

export const nameBodyTemplate = (rowData) => {
  return <NavLink to={"../../viewer/" + rowData.id}>{rowData.name}</NavLink>;
};

export const orgBodyTemplate = (rowData) => {
  const { getOrgNameById } = AppOrgResolver();
  return getOrgNameById(rowData.primaryOrgId);
};

export const projectStageFilter = (data, options) => (
  <MultiSelectFilter data={data} filterProperty="stage" options={options} />
);

export const statusFilter = (data, options) => (
  //console.log("options", options),
  <MultiSelect
    value={options.value}
    optionLabel="label"
    optionValue="value"
    options={[
      { label: "Active", value: false },
      { label: "Removed", value: true },
    ]}
    onChange={(e) => options.filterApplyCallback(e.value)}
    className="p-column-filter"
    showClear
  />
);

export const orgFilter = (data, options) => (
  <MultiSelectFilter
    data={data}
    filterProperty="primaryOrgName"
    options={options}
    showClear
  />
);

export const stageBodyTemplate = (rowData) => {
  return (
    <PortfolioStageDropdown readOnlyStage={rowData.stage} readOnly={true} />
  );
};

export const statusBodyTemplate = (rowData) => {
  return rowData.isProjectRemoved ? "Removed" : "Active";
};

// Body template for "Date" column in DataTable
export const dateBodyTemplate = (rowData) => {
  let todaysDate = new Date().setHours(0, 0, 0, 0);

  let inputDate = new Date(rowData.h2LPredictedStart).setHours(0, 0, 0, 0);
  let stageDate = rowData.h2LPredictedStart;

  if (rowData.stage === "H2L") {
    inputDate = new Date(rowData.loPredictedStart).setHours(0, 0, 0, 0);
    stageDate = rowData.loPredictedStart;
  }
  if (rowData.stage === "LO") {
    inputDate = new Date(rowData.spPredictedStart).setHours(0, 0, 0, 0);
    stageDate = rowData.spPredictedStart;
  }
  if (rowData.stage === "SP") {
    inputDate = new Date(rowData.indPredictedStart).setHours(0, 0, 0, 0);
    stageDate = rowData.indPredictedStart;
  }
  // if (rowData.indEnabled) {
  //   inputDate = new Date(rowData.indStart).setHours(0, 0, 0, 0);
  //   stageDate = rowData.indStart;
  // }
  // if (rowData.clinicalP1Enabled) {
  //   inputDate = new Date(rowData.clinicalP1Start).setHours(0, 0, 0, 0);
  //   stageDate = rowData.clinicalP1Start;
  // }

  if (rowData.isProjectRemoved === true) {
    return (
      <>
        <span className="p-column-title">Date</span>
        <FDate
          className="p-column-title"
          timestamp={stageDate}
          color={"#9EA29D"}
        />
      </>
    );
  }

  if (rowData.stage == "IND" || rowData.stage == "P1") {
    return (
      <>
        <span className="p-column-title">Date</span>
        <FDate
          className="p-column-title"
          timestamp={stageDate}
          color={"#1D7E00"}
        />
      </>
    );
  }

  if (rowData.isProjectRemoved === false && inputDate < todaysDate) {
    return (
      <>
        <span className="p-column-title">Date</span>
        <FDate
          className="p-column-title"
          timestamp={stageDate}
          color={"#9B8800"}
        />
      </>
    );
  }
  return (
    <>
      <span className="p-column-title">Date</span>
      <FDate
        className="p-column-title"
        timestamp={stageDate}
        color={"#1D7E00"}
      />
    </>
  );
};
