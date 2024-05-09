import { observer } from "mobx-react-lite";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useContext, useEffect } from "react";

import Loading from "../../../../../Library/Loading/Loading";
import { RootStoreContext } from "../../../../../RootStore";
import * as Helper from "./FPPDAllPostPortfolioProjectsHelper";

const FPPDAllPostPortfolioProjects = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    fetchProjects,
    isProjectListCacheValid,
    postPortfolioList,
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
          value={postPortfolioList}
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
            field="primaryOrgAlias"
            header="Primary Org"
            filter
            filterMatchMode="contains"
            className="narrow-column"
          />

          <Column
            //field="isProjectRemoved"
            header="Status"
            body={Helper.statusBodyTemplate}
            filter
            filterField="isProjectRemoved"
            filterElement={(options) =>
              Helper.statusFilter(postPortfolioList, options)
            }
            showFilterMenu={false}
            filterMatchMode="in"
            className="narrow-column"
          />

          <Column
            field="stage"
            header="Post Portfolio Stage"
            filter
            filterField="stage"
            filterElement={(options) =>
              Helper.projectStageFilter(postPortfolioList, options)
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

export default observer(FPPDAllPostPortfolioProjects);
