import { observer } from "mobx-react-lite";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Sidebar } from "primereact/sidebar";
import React, { useContext, useState } from "react";
import { RootStoreContext } from "../../../../../../RootStore";
import FSTbVHAddHit from "./FSTbVHitsHelper/FSTbVHAddHit";
import { FSTbVHDataTableHeader } from "./FSTbVHitsHelper/FSTbVHDataTableHeader";
import {
  LibraryBodyTemplate,
  StructureBodyTemplate,
} from "./FSTbVHitsHelper/FSTbVHDataTableHelper";

const FSTbVHits = ({ hitCollection }) => {
  console.log("FSTbVHits hitCollection", hitCollection);

  const rootStore = useContext(RootStoreContext);
  const { setSelectedHitCollection, selectedHitCollection } =
    rootStore.hitCollectionStore;
  const { selectedScreen } = rootStore.screenStore;
  setSelectedHitCollection(hitCollection.id);

  const [displayAddHitSideBar, setDisplayAddHitSideBar] = useState(false);

  const addHitSideBarHeader = (
    <div className="flex align-items-center gap-2">
      <i className="icon icon-common icon-plus-circle"></i>
      <span className="font-bold">Add Hit</span>
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
                selectedHitCollection={selectedHitCollection}
                selectedScreen={selectedScreen}
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
            <Column
              field={(rowData) => rowData?.requestedSMILES}
              header="Structure"
              body={StructureBodyTemplate}
            />

            <Column
              field={(rowData) => rowData?.library + " | " + rowData.source}
              header="Library | Source"
              body={LibraryBodyTemplate}
            />

            <Column
              field={(rowData) => rowData?.molecule?.name}
              header="Name"
            />
            <Column
              field={(rowData) => rowData?.iC50}
              header="IC50 (&micro;M) "
            />
            <Column field={(rowData) => rowData?.mic} header="MIC (&micro;M)" />
            <Column field={(rowData) => rowData?.cluster} header="Cluster" />
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
        <FSTbVHAddHit
          closeSideBar={() => setDisplayAddHitSideBar(false)}
          hitCollectionId={hitCollection.id}
        />
      </Sidebar>
    </>
  );
};

export default observer(FSTbVHits);
