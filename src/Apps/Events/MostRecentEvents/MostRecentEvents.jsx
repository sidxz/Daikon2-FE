import { observer } from "mobx-react-lite";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Skeleton } from "primereact/skeleton";
import { forwardRef, useContext, useEffect, useImperativeHandle } from "react";
import { NavLink } from "react-router-dom";
import FDate from "../../../Library/FDate/FDate";
import RichTextDisplay from "../../../Library/RichTextEdit/RichTextDisplay/RichTextDisplay";
import { RootStoreContext } from "../../../RootStore";

const MostRecentEvents = forwardRef((props, ref) => {
  const rootStore = useContext(RootStoreContext);
  const { fetchRecentEvents, isFetchingRecentEvents, mostRecentEvents } =
    rootStore.eventHistoryStore;

  useEffect(() => {
    fetchRecentEvents();
  }, []);

  // Expose the refresh function to the parent component
  useImperativeHandle(ref, () => ({
    refreshEvents: () => {
      fetchRecentEvents(true);
    },
  }));

  if (isFetchingRecentEvents)
    return (
      <div className="flex flex-column w-full card-container">
        <Skeleton height="20rem" className="mb-2"></Skeleton>
      </div>
    );

  // console.log("mostRecentEvents", mostRecentEvents);
  return (
    <div className="flex w-full">
      <DataTable
        value={mostRecentEvents}
        className="HideDataTableHeader w-full"
        paginator
        rows={10}
      >
        <Column
          className="narrow-column p-0 m-0"
          field="timeStamp"
          body={(rowData) => (
            <div className="flex align-items-center justify-content-center text-color-secondary text-xs surface-50 border-round-md p-1">
              <FDate timestamp={rowData.timeStamp} color="#70829a" />
            </div>
          )}
        ></Column>
        <Column
          field="eventMessage"
          body={(rowData) => (
            <NavLink
              to={rowData.link}
              className="text-color-secondary no-underline"
            >
              <RichTextDisplay data={rowData.eventMessage} />
            </NavLink>
          )}
        ></Column>
      </DataTable>
    </div>
  );
});

export default observer(MostRecentEvents);
