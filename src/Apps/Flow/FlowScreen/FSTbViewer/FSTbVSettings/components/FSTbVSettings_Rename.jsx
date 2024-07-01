import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import { BlockUI } from "primereact/blockui";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import React, { useContext } from "react";
import { RootStoreContext } from "../../../../../../RootStore";
import { AppOrgResolver } from "../../../../../../Shared/VariableResolvers/AppOrgResolver";
import { GlobalValuesResolver } from "../../../../../../Shared/VariableResolvers/GlobalValuesResolver";
const FSTbVSettings_Rename = () => {
  const rootStore = useContext(RootStoreContext);

  const { renameScreen, isUpdatingScreen, selectedScreen, isFetchingScreen } =
    rootStore.screenStore;

  const { getScreeningGlobals } = GlobalValuesResolver();
  const { getOrgNameById } = AppOrgResolver();

  const formik = useFormik({
    initialValues: {
      name: selectedScreen.name,
      // participatingOrgsId: [],
    },

    validate: (values) => {
      const errors = {};
      if (!values.name) errors.name = "Name is required.";
      // Additional validations can be added here
      return errors;
    },

    onSubmit: (newScreen) => {
      var screenToSubmit = { ...selectedScreen, ...newScreen };
      renameScreen(screenToSubmit);
    },
  });

  // Helper functions for form validation and error messages
  const isInvalid = (field) => formik.touched[field] && formik.errors[field];
  const getErrorMessage = (field) =>
    isInvalid(field) && (
      <small className="p-error">{formik.errors[field]}</small>
    );

  return (
    <BlockUI blocked={isUpdatingScreen || isFetchingScreen}>
      <div className="card w-full">
        <form
          onSubmit={formik.handleSubmit}
          className="p-fluid"
          onKeyDown={(e) => {
            e.key === "Enter" && e.preventDefault();
          }}
        >
          <div className="field">
            <label
              htmlFor="name"
              className={classNames({
                "p-error": isInvalid("name"),
              })}
            >
              Screen Name
            </label>
            <InputText
              id="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              className={classNames({
                "p-invalid": isInvalid("name"),
              })}
            />
            {getErrorMessage("name")}
          </div>

          <Button
            icon="icon icon-common icon-database-submit"
            type="submit"
            label="Save"
            className="p-mt-2 w-2"
            loading={isUpdatingScreen}
          />
        </form>
      </div>
    </BlockUI>
  );
};

export default observer(FSTbVSettings_Rename);
