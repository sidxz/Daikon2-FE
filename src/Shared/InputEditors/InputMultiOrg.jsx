import { MultiSelect } from "primereact/multiselect";
import React, { useContext } from "react";
import { RootStoreContext } from "../../RootStore";

const InputMultiOrg = (props) => {
  const rootStore = useContext(RootStoreContext);
  const { appVars } = rootStore.authStore;

  // Convert the orgs object into an array of option objects for the Dropdown
  let orgDropDownOptions = [];
  // check if appVars.orgsVisible is defined and not empty
  if (appVars.orgsVisible) {
    orgDropDownOptions = Object.entries(appVars.orgsVisible).map(
      ([id, name]) => ({
        value: id, // Use the key as the option value
        name: name, // Use the value as the option label
      })
    );
  } else {
    orgDropDownOptions = Object.entries(appVars.orgs).map(([id, name]) => ({
      value: id, // Use the key as the option value
      name: name, // Use the value as the option label
    }));
  }

  return (
    <MultiSelect
      {...props}
      options={orgDropDownOptions}
      optionLabel="name"
      optionValue="value"
      placeholder="Select an org"
      filter
      showClear
      filterBy="name"
      filterIcon="pi pi-search"
    />
  );
};

export default InputMultiOrg;
