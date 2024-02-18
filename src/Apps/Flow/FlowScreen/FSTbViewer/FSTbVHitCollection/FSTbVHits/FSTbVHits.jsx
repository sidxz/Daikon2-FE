import { observer } from "mobx-react-lite";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Sidebar } from "primereact/sidebar";
import React, { useContext, useState } from "react";
import { RootStoreContext } from "../../../../../../RootStore";
import FSTbVHAddHit from "./FSTbVHitsHelper/FSTbVHAddHit";
import { FSTbVHDataTableHeader } from "./FSTbVHitsHelper/FSTbVHDataTableHeader";

const FSTbVHits = ({ hitCollection }) => {
  console.log("FSTbVHits hitCollection", hitCollection.id);

  const rootStore = useContext(RootStoreContext);
  const { hitCollectionRegistry } = rootStore.hitCollectionStore;

  const [displayAddHitSideBar, setDisplayAddHitSideBar] = useState(false);

  const addHitSideBarHeader = (
    <div className="flex align-items-center gap-2">
      <i className="icon icon-common icon-plus-circle"></i>
      <span className="font-bold">Add Screen</span>
    </div>
  );

  return (
    <>
      <div className="flex flex-column w-full">
        <div className="flex w-full">
          <DataTable
            className="p-datatable-gridlines w-full"
            size="small"
            //ref={dt}
            value={hitCollection.hits}
            // paginator
            scrollable
            // rows={50}
            header={
              <FSTbVHDataTableHeader
                showAddHitSideBar={() => setDisplayAddHitSideBar(true)}
              />
            }
            //className="p-datatable-screen-table"
            //globalFilter={globalFilter}
            emptyMessage="No hits found."
            resizableColumns
            columnResizeMode="fit"
            showGridlines
            //selection={selectedCompounds}
            //onSelectionChange={(e) => setSelectedCompounds(e.value)}
            dataKey="id"
            //exportFilename={`Hits-${selectedTargetBasedScreen.screenName}-${selectedTargetBasedScreen.method}.csv`}
          >
            <Column field="id" header="ID" />
          </DataTable>
        </div>
      </div>
      <Sidebar
        visible={displayAddHitSideBar}
        position="right"
        onHide={() => setDisplayAddHitSideBar(false)}
        className="p-sidebar-md"
        header={addHitSideBarHeader}
      >
        <FSTbVHAddHit closeSideBar={() => setDisplayAddHitSideBar(false)} />
      </Sidebar>
    </>
  );
};

export default observer(FSTbVHits);
