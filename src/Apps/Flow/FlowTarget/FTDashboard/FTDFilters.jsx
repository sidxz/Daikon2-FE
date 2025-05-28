import { observer } from "mobx-react-lite";
import { ToggleButton } from "primereact/togglebutton";
import { Toolbar } from "primereact/toolbar";

import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { RootStoreContext } from "../../../../RootStore";

const FTDFilters = () => {
  const rootStore = useContext(RootStoreContext);
  const { setFilterCriteria, filterCriteria } = rootStore.targetStore;

  const [searchParams, setSearchParams] = useSearchParams();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      const localFilters = localStorage.getItem("targetDashFilterCriteria");
      let parsedFilters = {};

      try {
        parsedFilters = localFilters ? JSON.parse(localFilters) : {};
      } catch (error) {
        console.error("Error parsing local storage filters:", error);
      }

      // Load from URL first, otherwise fallback to localStorage, otherwise default to [0,1]
      const storedPriority = searchParams.get("priority")
        ? searchParams.get("priority").split(",").map(Number)
        : parsedFilters.priority || [0, 1];

      setFilterCriteria({ priority: storedPriority });
      setIsInitialized(true);
    }
  }, [isInitialized, searchParams, setFilterCriteria]);

  useEffect(() => {
    if (isInitialized) {
      const params = {};
      if (filterCriteria.priority.length) {
        params.priority = filterCriteria.priority.join(","); // Convert to comma-separated string for URL
      }

      setSearchParams(params, { replace: true });

      try {
        localStorage.setItem(
          "targetDashFilterCriteria",
          JSON.stringify({
            priority: filterCriteria.priority.map(Number), // Ensure numbers are stored
          })
        );
      } catch (error) {
        console.error("Error saving filters to local storage:", error);
      }
    }
  }, [filterCriteria, isInitialized, setSearchParams]);

  console.log("filterCriteria", filterCriteria);

  // Toggle button handler
  const handleToggleChange = (e) => {
    const newPriority = e.value ? [1] : [0, 1]; // Toggle between [1] (Top 25) and [0,1] (All)
    setFilterCriteria({ priority: newPriority });
  };

  const filtersUi = (
    <div className="flex border-50 border-round-md border-1">
      <ToggleButton
        checked={
          filterCriteria.priority.length === 1 &&
          filterCriteria.priority.includes(1)
        }
        onChange={handleToggleChange}
        onLabel="High Interest Targets"
        offLabel="All Targets"
        onIcon="pi pi-star-fill"
        offIcon="pi pi-bullseye"
        className="border-0 w-full surface-50 p-button-sm"
        size="small"
      />
    </div>
  );

  return (
    <div className="flex w-full m-0 p-0 border-bottom-2 border-50">
      <Toolbar end={filtersUi} className="w-full m-0 p-0 border-0" />
    </div>
  );
};

export default observer(FTDFilters);
