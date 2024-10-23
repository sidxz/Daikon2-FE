import { observer } from "mobx-react-lite";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Skeleton } from "primereact/skeleton";
import { useContext, useEffect } from "react";
import FDate from "../../../Library/FDate/FDate";
import { RootStoreContext } from "../../../RootStore";

const MostRecentEvents = () => {
  const rootStore = useContext(RootStoreContext);
  const { fetchRecentEvents, isFetchingRecentEvents, mostRecentEvents } =
    rootStore.eventHistoryStore;

  useEffect(() => {
    fetchRecentEvents();
  }, []);

  if (isFetchingRecentEvents)
    return (
      <div className="flex flex-column w-full card-container">
        <Skeleton height="20rem" className="mb-2"></Skeleton>
      </div>
    );
  console.log("mostRecentEvents", mostRecentEvents);
  return (
    <div className="flex w-full">
      <DataTable
        value={mostRecentEvents}
        className="HideDataTableHeader w-full"
      >
        <Column
          field="timeStamp"
          body={(rowData) => <FDate timestamp={rowData.timeStamp} />}
        ></Column>
        <Column field="eventMessage"></Column>
      </DataTable>
    </div>
  );
};

export default observer(MostRecentEvents);
