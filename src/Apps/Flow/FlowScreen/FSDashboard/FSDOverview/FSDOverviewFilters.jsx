import { observer } from "mobx-react-lite";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { Toolbar } from "primereact/toolbar";
import React, { useContext, useEffect, useState } from "react";
import { MdGridView } from "react-icons/md";
import { useSearchParams } from "react-router-dom";
import { RootStoreContext } from "../../../../../RootStore";
import { GlobalValuesResolver } from "../../../../../Shared/VariableResolvers/GlobalValuesResolver";

const FSDOverviewFilters = ({ dashDisplay, setDashDisplay }) => {
  const rootStore = useContext(RootStoreContext);
  const { getFilterAttributes, setFilterCriteria, filterCriteria } =
    rootStore.screenStore;

  const [searchParams, setSearchParams] = useSearchParams();
  const filterOptions = getFilterAttributes();
  const [dates, setDates] = useState(filterCriteria.dateRange || [null, null]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { getScreeningGlobals } = GlobalValuesResolver();

  // Load filters from URL params or localStorage on component mount
  useEffect(() => {
    if (!isInitialized) {
      const localFilters = JSON.parse(
        localStorage.getItem("screenDashFilterCriteria")
      );
      const initialFilters = {
        targets: searchParams.get("targets")
          ? searchParams.get("targets").split(",")
          : localFilters?.targets || [],
        primaryOrgAliases: searchParams.get("primaryOrgAliases")
          ? searchParams.get("primaryOrgAliases").split(",")
          : localFilters?.primaryOrgAliases || [],
        methods: searchParams.get("methods")
          ? searchParams.get("methods").split(",")
          : localFilters?.methods || [],
        dateRange: searchParams.get("dateRange")
          ? searchParams
              .get("dateRange")
              .split(",")
              .map((date) => new Date(date))
          : localFilters?.dateRange || [null, null],
      };
      setFilterCriteria(initialFilters);
      setIsInitialized(true);
    }
  }, [isInitialized, searchParams, setFilterCriteria]);

  // Save filter criteria to URL params and localStorage when they change
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
      setSearchParams(params, { replace: true });
      localStorage.setItem(
        "screenDashFilterCriteria",
        JSON.stringify(filterCriteria)
      );
    }
  }, [filterCriteria, isInitialized, setSearchParams]);

  const viewOptions = [
    { value: "All" },
    { value: "Target Based" },
    { value: "Phenotypic" },
  ];

  const content1 = (
    <div className="flex border-0 border-50 border-round-md">
      <MultiSelect
        value={filterCriteria.targets}
        onChange={(e) => setFilterCriteria({ targets: e.value })}
        options={filterOptions.targets}
        placeholder="Target"
        showClear
        filter
        display="chip"
        className="border-0 w-full surface-50"
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
        className="border-0 w-full surface-50"
      />
      <MultiSelect
        value={filterCriteria.methods}
        onChange={(e) => setFilterCriteria({ methods: e.value })}
        optionLabel="name"
        answer="value"
        options={getScreeningGlobals().screeningMethods}
        placeholder="Method"
        maxSelectedLabels={3}
        showClear
        filter
        display="chip"
        className="border-0 w-full surface-50"
      />
      <Dropdown
        icon="pi pi-check"
        className="border-0 p-0 m-0 surface-50"
        value={dashDisplay}
        onChange={(e) => setDashDisplay(e.value)}
        options={viewOptions}
        optionValue="value"
        optionLabel="value"
        valueTemplate={(option) => <MdGridView />}
      />
    </div>
  );

  return (
    <div className="div border-0 w-full m-0 p-0 ">
      <Toolbar end={content1} className="m-0 p-0 border-0" />
    </div>
  );
};

export default observer(FSDOverviewFilters);
