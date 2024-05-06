import { Dropdown } from "primereact/dropdown";
import { useContext } from "react";
import { RootStoreContext } from "../../RootStore";

export const OrgRowEditorDVar = (options) => {
  const rootStore = useContext(RootStoreContext);
  const { appVars } = rootStore.authStore;

  let opts = Object.keys(appVars.orgsAlias).map((key) => {
    return { name: appVars.orgsAlias[key], value: key };
  });

  let onchangeDVar = (e) => {
    let value = { value: e.target.value };
    options.editorCallback(value);
  };

  return (
    <Dropdown
      id="org_editor"
      value={options.value ? options.value.value : ""}
      options={opts}
      onChange={(e) => onchangeDVar(e)}
      placeholder="Select an organization"
      optionLabel="name"
    />
  );
};
