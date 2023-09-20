import { observer } from "mobx-react-lite";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { MultiSelect } from "primereact/multiselect";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import React, { useContext, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import FDate from "../../../../app/common/FDate/FDate";
import Loading from "../../../../app/layout/Loading/Loading";
import { RootStoreContext } from "../../../../app/stores/rootStore";
import "./HADashDataTable.css";
// import "./PortfolioDashDataTable.css";
import HAStatus from "../../../../app/common/HAStatus/HAStatus";
import TagGeneral from "../../../../app/common/TagGeneral/TagGeneral";

const HAList = () => {
  /* MobX Store */
  const rootStore = useContext(RootStoreContext);
  const { loadingProjects, fetchProjects, projectRegistry } =
    rootStore.projectStore;
  const { filterHAProjects } = rootStore.haStore;

  /* Local State Management */

  useEffect(() => {
    if (projectRegistry.size === 0) {
      fetchProjects();
    }
  }, [fetchProjects, projectRegistry]); // eslint-disable-line react-hooks/exhaustive-deps

  /* local variables */

  const dt = useRef(null);
  let todaysDate = new Date().setHours(0, 0, 0, 0);

  const stageItemTemplate = (option) => {
    return <span className={`customer-badge status-${option}`}>{option}</span>;
  };

  /* STATUS FILTER */
  const statusFilter = (options) => {
    const valueToStateMap = {
      Active: true,
      Terminated: false,
    };

    const stateToValueMap = {
      true: "Active",
      false: "Terminated",
      null: null, // Represents "All"
    };

    return (
      <div className="p-column-filter">
        <TriStateCheckbox
          value={valueToStateMap[options.value]}
          onChange={(e) => {
            options.filterApplyCallback(stateToValueMap[e.value]);
          }}
        />
        <label style={{ marginLeft: "5px" }}>{options.value || "All"}</label>
      </div>
    );
  };

  /* END STATUS FILTER */

  /* HA STATUS FILTER */

  const haStatuses = ["HA Ready", "HA Active", "HA Incorrect m/z", "HA Known Liability", "HA Complete Success", "HA Complete Failed"];



  // HA Status filter component for DataTable
  const haStatusFilter = (options) => (

    <MultiSelect
      value={options.value}
      options={haStatuses}
      onChange={(e) => options.filterApplyCallback(e.value)}
      placeholder="Select HA Status"
      className="p-column-filter"
    />
  );

  /* END HA STATUS FILTER */


  const TargetBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Target</span>
        {rowData.targetName}
      </React.Fragment>
    );
  };

  const ProjectNoBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Project Id</span>
        {rowData.id.substring(0, 8)}
      </React.Fragment>
    );
  };

  const ProjectNameBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Project Name</span>
        <b>
          <NavLink to={"./" + rowData.id}>{rowData.projectName}</NavLink>
        </b>
      </React.Fragment>
    );
  };

  const PrimaryOrganizationBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Primary Organization</span>
        {rowData.primaryOrg.alias}
      </React.Fragment>
    );
  };

  const StatusBodyTemplate = (rowData) => {
    return <TagGeneral tag={rowData.status} />;
  };

  const HAStatusBodyTemplate = (rowData) => {
    return (
      <HAStatus id={rowData.id} status={rowData.haStatus} readOnly={true} />
    );
  };

  const DateBodyTemplate = (rowData) => {
    let inputDate = new Date(rowData.h2LPredictedStart).setHours(0, 0, 0, 0);
    let stageDate = rowData.h2LPredictedStart;

    if (rowData.status === "Terminated") {
      return (
        <React.Fragment>
          <span className="p-column-title">Date</span>
          <FDate
            className="p-column-title"
            timestamp={stageDate}
            color={"#9EA29D"}
          />
        </React.Fragment>
      );
    }
    if (rowData.h2LEnabled) {
      return (
        <React.Fragment>
          <span className="p-column-title">Date</span>
          <FDate
            className="p-column-title"
            timestamp={stageDate}
            color={"#1D7E00"}
          />
        </React.Fragment>
      );
    }
    if (rowData.status === "Active" && inputDate < todaysDate) {
      return (
        <React.Fragment>
          <span className="p-column-title">Date</span>
          <FDate
            className="p-column-title"
            timestamp={stageDate}
            color={"#9B8800"}
          />
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <span className="p-column-title">Date</span>
        <FDate
          className="p-column-title"
          timestamp={stageDate}
          color={"#1D7E00"}
        />
      </React.Fragment>
    );
  };

  /** Loading Overlay */
  if (loadingProjects) {
    return <Loading />;
  }

  return (
    <div className="card w-full">
      <DataTable
        ref={dt}
        value={filterHAProjects()}
        paginator
        rows={20}
        size="small"
        // header={header}
        className="datatable-ha-dash"
        //globalFilter={globalFilter}
        emptyMessage="No HAs found."
        filterDisplay="row"
      >
        <Column
          field="id"
          header="Project Id"
          body={ProjectNoBodyTemplate}
          filter
          filterMatchMode="contains"
          filterPlaceholder="Search by ProjectNo"
          className="narrow-column"
        />

        <Column
          field="projectName"
          header="Project Name"
          filter
          filterMatchMode="contains"
          filterPlaceholder="Search by ProjectName"
          body={ProjectNameBodyTemplate}
        />

        <Column
          field="targetName"
          header="Target"
          body={TargetBodyTemplate}
          filter
          filterMatchMode="contains"
          filterPlaceholder="Filter by Target"
          className="narrow-column"
        />

        <Column
          field="primaryOrg.alias"
          header="Primary Org"
          filter
          filterMatchMode="contains"
          body={PrimaryOrganizationBodyTemplate}
        />

        <Column
          field="haStatus"
          header="HA Status"
          body={HAStatusBodyTemplate}
          filter
          filterField="haStatus"
          filterElement={haStatusFilter}
          showFilterMenu={false}
          filterMatchMode="in"

        />

        <Column
          field="status"
          header="Project Status"
          body={StatusBodyTemplate}
          filter
          filterElement={statusFilter}
          showFilterMenu={false}
          defaultFilter={true}
        />

        <Column
          field="Date"
          header="H2L Predicted Start"
          body={DateBodyTemplate}
        />
      </DataTable>
    </div>
  );
};

export default observer(HAList);
