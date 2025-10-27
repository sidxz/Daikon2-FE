import { Dropdown } from "primereact/dropdown";
import { useContext } from "react";
import { RootStoreContext } from "../../RootStore";

const InputOrgAlias = (props) => {
  const rootStore = useContext(RootStoreContext);
  const { appVars } = rootStore.authStore;

  // Convert the orgsAlias object into an array of option objects for the Dropdown
  let orgDropDownOptions = [];
  // check if appVars.orgsAliasVisible is defined and not empty
  if (appVars.orgsAliasVisible) {
    orgDropDownOptions = Object.entries(appVars.orgsAliasVisible).map(
      ([id, name]) => ({
        value: id, // Use the key as the option value
        name: name, // Use the value as the option label
      })
    );
  } else {
    orgDropDownOptions = Object.entries(appVars.orgsAlias).map(
      ([id, name]) => ({
        value: id, // Use the key as the option value
        name: name, // Use the value as the option label
      })
    );
  }

  // sort the orgsAlias by name
  orgDropDownOptions.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Dropdown
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

export default InputOrgAlias;
