import { observer } from "mobx-react-lite";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import React, { useRef, useState } from "react";
import MostRecentEvents from "../../../Events/MostRecentEvents/MostRecentEvents";

const FlowDashEventUpdates = () => {
  const mostRecentEventsRef = useRef();
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const handleRefreshClick = () => {
    mostRecentEventsRef.current.refreshEvents();
  };

  const renderHeader = () => {
    return (
      <div className="flex border-0 justify-content-center flex-wrap">
        <div className="flex border-0 align-items-center">
          <IconField iconPosition="left">
            <InputIcon className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Keyword Search"
              size={20}
            />
          </IconField>
        </div>
      </div>
    );
  };

  const searchHeader = renderHeader();

  const cardTitle = (icon, text) => (
    <div className="flex flex-column w-full border-0">
      {/* <div
        className="justify-content-end flex m-0 p-0 text-cyan-700 text-sm pl-3 align-items-center"
        onClick={handleRefreshClick}
        style={{ cursor: "pointer" }}
      >
        Refresh
      </div> */}
      <div
        className="flex justify-content-center m-0 p-0 border-0"
        style={{ margin: "0px", marginBottom: "-10px" }}
      >
        <div
          className="flex p-1 mr-1 text-cyan-700 text-2xl cursor-pointer"
          onClick={handleRefreshClick}
        >
          <i className={icon} />
        </div>
        <div className="flex m-0 p-0 text-cyan-700 text-2xl">{text}</div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-column w-full m-0 p-0 gap-1">
      <div className="flex">
        <div className="flex justify-content-start w-full">
          <p className="flex text-2xl mt-0 mb-1 mt-2 ml-3 font-bold text-gray-700 text-left">
            Activity Feed
          </p>
        </div>
        <div className="flex w-full justify-content-end align-items-end mb-1 mr-2 mt-2 gap-2 border-round-md">
          <div className="flex">{searchHeader}</div>
          <div className="flex">
            <Button icon="pi pi-file-export" />
          </div>
        </div>
      </div>

      <div className="p-3 border-round-md border-black-alpha-30">
        <MostRecentEvents ref={mostRecentEventsRef} filters={filters} />
      </div>
    </div>
  );
};

export default observer(FlowDashEventUpdates);
