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
    projectList,
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
          value={projectList}
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
            // filterElement={(options) => Helper.orgFilter(projectList, options)}
            showFilterMenu={false}
            filterMatchMode="in"
            className="narrow-column"
          />

          <Column
            field="projectStage"
            header="Portfolio Stage"
            filter
            filterField="projectStage"
            filterElement={(options) =>
              Helper.projectStageFilter(projectList, options)
            }
            showFilterMenu={false}
            filterMatchMode="in"
            className="narrow-column"
            body={Helper.stageBodyTemplate}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default observer(FPDAllPortfolioProjects);
