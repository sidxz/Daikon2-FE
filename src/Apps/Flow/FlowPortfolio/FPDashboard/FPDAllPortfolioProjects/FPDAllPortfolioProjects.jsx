import { observer } from "mobx-react-lite";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useContext, useEffect } from "react";
import Loading from "../../../../../Library/Loading/Loading";
import { RootStoreContext } from "../../../../../RootStore";
import * as Helper from "./FPDAllPortfolioProjectsHelper";

const FPDAllPortfolioProjects = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    fetchProjects,
    isProjectListCacheValid,
    portfolioList,
    isFetchingProjects,
  } = rootStore.projectStore;

  useEffect(() => {
    if (!isProjectListCacheValid) {
      fetchProjects();
    }
  }, [isProjectListCacheValid, fetchProjects]);

  if (isFetchingProjects) {
    return <Loading message={"Fetching Projects..."} />;
  }

  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500">
      <div className="flex w-full">
        <DataTable
          className="w-full"
          value={portfolioList}
          paginator
          rows={10}
          filterDisplay="row"
        >
          <Column
            body={Helper.nameBodyTemplate}
            field="name"
            header="Project Name"
            filter
            filterMatchMode="contains"
            filterPlaceholder="Search"
            className="narrow-column"
            sortable
          />

          <Column
            field="primaryOrgId"
            header="Primary Org"
            body={Helper.orgBodyTemplate}
            filter
            // filterField="primaryOrgName"
            // filterElement={(options) => Helper.orgFilter(portfolioList, options)}
            showFilterMenu={false}
            filterMatchMode="in"
            className="narrow-column"
          />

          <Column
            //field="isProjectRemoved"
            header="Status"
            body={Helper.statusBodyTemplate}
            filter
            filterField="isProjectRemoved"
            filterElement={(options) =>
              Helper.statusFilter(portfolioList, options)
            }
            showFilterMenu={false}
            filterMatchMode="in"
            className="narrow-column"
          />

          <Column
            field="stage"
            header="Stage"
            filter
            filterField="stage"
            filterElement={(options) =>
              Helper.projectStageFilter(portfolioList, options)
            }
            showFilterMenu={false}
            filterMatchMode="in"
            className="narrow-column"
            body={Helper.stageBodyTemplate}
          />

          <Column
            field="Date"
            header="Predicted Date"
            className="narrow-column"
            body={Helper.dateBodyTemplate}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default observer(FPDAllPortfolioProjects);
