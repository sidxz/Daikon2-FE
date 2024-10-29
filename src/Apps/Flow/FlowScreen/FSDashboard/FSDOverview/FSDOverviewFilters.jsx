import { observer } from "mobx-react-lite";
import { MultiSelect } from "primereact/multiselect";
import { Toolbar } from "primereact/toolbar";
import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { RootStoreContext } from "../../../../../RootStore";
import "./FSDOverviewFilters.css";

const FSDOverviewFilters = () => {
  const rootStore = useContext(RootStoreContext);
  const { getFilterAttributes, setFilterCriteria, filterCriteria } =
    rootStore.screenStore;

  const [searchParams, setSearchParams] = useSearchParams();
  const filterOptions = getFilterAttributes();
  const [dates, setDates] = useState(filterCriteria.dateRange || [null, null]);
  const [isInitialized, setIsInitialized] = useState(false); // Track initialization

  // Initialize filters from URL params on component mount
  useEffect(() => {
    if (!isInitialized) {
      const initialFilters = {
        targets: searchParams.get("targets")
          ? searchParams.get("targets").split(",")
          : [],
        primaryOrgAliases: searchParams.get("primaryOrgAliases")
          ? searchParams.get("primaryOrgAliases").split(",")
          : [],
        methods: searchParams.get("methods")
          ? searchParams.get("methods").split(",")
          : [],
        dateRange: searchParams.get("dateRange")
          ? searchParams
              .get("dateRange")
              .split(",")
              .map((date) => new Date(date))
          : [null, null],
      };
      console.log("Initializing filters from URL params:", initialFilters);
      setFilterCriteria(initialFilters);
      setIsInitialized(true); // Mark as initialized
    }
  }, [isInitialized, searchParams, setFilterCriteria]);

  // Update URL params when filter criteria change, but only after initialization
  useEffect(() => {
    if (isInitialized) {
      const params = {};
      if (filterCriteria.targets?.length) {
        params.targets = filterCriteria.targets.join(",");
      }
      if (filterCriteria.primaryOrgAliases?.length) {
        params.primaryOrgAliases = filterCriteria.primaryOrgAliases.join(",");
      }
      if (filterCriteria.methods?.length) {
        params.methods = filterCriteria.methods.join(",");
      }
      if (
        filterCriteria.dateRange &&
        filterCriteria.dateRange[0] &&
        filterCriteria.dateRange[1]
      ) {
        params.dateRange = filterCriteria.dateRange
          .map((date) => date.toISOString())
          .join(",");
      }
      setSearchParams(params, { replace: true }); // Use replace to avoid adding to history
    }
  }, [filterCriteria, isInitialized, setSearchParams]);

  const centerContent = (
    <React.Fragment>
      <MultiSelect
        value={filterCriteria.targets}
        onChange={(e) => setFilterCriteria({ targets: e.value })}
        options={filterOptions.targets}
        placeholder="Target"
        //maxSelectedLabels={5}
        showClear
        filter
        display="chip"
        className="border-0 w-full"
      />
      <MultiSelect
        value={filterCriteria.primaryOrgAliases}
        onChange={(e) => setFilterCriteria({ primaryOrgAliases: e.value })}
        options={filterOptions.primaryOrgAliases}
        placeholder="Organization"
        maxSelectedLabels={3}
        showClear
        filter
        display="chip"
        className="border-0 w-full"
      />
      <MultiSelect
        value={filterCriteria.methods}
        onChange={(e) => setFilterCriteria({ methods: e.value })}
        options={filterOptions.methods}
        placeholder="Method"
        maxSelectedLabels={3}
        showClear
        filter
        display="chip"
        className="border-0 w-full"
      />
    </React.Fragment>
  );

  return (
    <div className="div border-0 w-full m-0 p-0">
      <Toolbar center={centerContent} className="m-0 p-0 border-0" />
    </div>
  );
};

export default observer(FSDOverviewFilters);
