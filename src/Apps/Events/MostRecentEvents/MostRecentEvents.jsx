import { observer } from "mobx-react-lite";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Skeleton } from "primereact/skeleton";
import { forwardRef, useContext, useEffect, useImperativeHandle } from "react";
import { NavLink } from "react-router-dom";
import FDate from "../../../Library/FDate/FDate";
import RichTextDisplay from "../../../Library/RichTextEdit/RichTextDisplay/RichTextDisplay";
import { RootStoreContext } from "../../../RootStore";
import styles from "./MostRecentEvents.module.css";
import { EventMapper } from "./MostRecentEventsHelper";

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

  console.log("mostRecentEvents", mostRecentEvents);
  return (
    <div className="flex w-full">
      <DataTable
        value={mostRecentEvents}
        className="HideDataTableHeader w-full"
        paginator
        rows={15}
        globalFilterFields={["eventType", "eventMessage"]}
        filterDisplay="row"
        filters={props.filters}
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
          className="narrow-column p-2 m-0 w-8rem"
          field="eventType"
          body={(rowData) => (
            <div className="flex w-full align-items-left justify-content-left text-color-secondary text-xs surface-50 border-round-md p-1">
              {EventMapper[rowData.eventType]}
            </div>
          )}
        ></Column>
        <Column
          className={styles.mre}
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
