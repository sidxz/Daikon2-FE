import { Dropdown } from "primereact/dropdown";
import React, { useContext } from "react";
import { RootStoreContext } from "../../RootStore";

const OrgEditorDVar = ({ id, formik, ...props }) => {
  const rootStore = useContext(RootStoreContext);
  const { appVars } = rootStore.authStore;

  let opts = Object.keys(appVars.orgs).map((key) => {
    return { name: appVars.orgs[key], value: key };
  });

  return (
    <>
      <Dropdown
        name={`${id}.value`}
        value={formik.values[id].value}
        onChange={formik.handleChange}
        options={opts}
        placeholder="Select an organization"
        optionLabel="name"
        {...props}
      />

      {/* <InputText
        name={`${id}.source`} // This name should match the path in formik values
        value={formik.values[id].condition.source || ""} // Ensuring controlled component
        onChange={formik.handleChange}
      /> */}
    </>
  );
};

export default OrgEditorDVar;
