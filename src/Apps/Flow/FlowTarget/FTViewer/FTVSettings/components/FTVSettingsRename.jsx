import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import { BlockUI } from "primereact/blockui";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import React, { useContext } from "react";
import { RootStoreContext } from "../../../../../../RootStore";
const FTVSettingsRename = () => {
  const rootStore = useContext(RootStoreContext);

  const { renameTarget, selectedTarget, isUpdatingTarget, isFetchingTarget } =
    rootStore.targetStore;

  const formik = useFormik({
    initialValues: {
      name: selectedTarget.name,
    },

    validate: (values) => {
      const errors = {};
      if (!values.name) errors.method = "Name is required.";
      // Additional validations can be added here
      return errors;
    },

    onSubmit: (newTarget) => {
      var targetToSubmit = { ...selectedTarget, ...newTarget };

      // console.log(
      //   "FTVSettingsUpdateGeneAssociation -> targetToSubmit",
      //   targetToSubmit
      // );

      renameTarget(targetToSubmit);
    },
  });

  // Helper functions for form validation and error messages
  const isInvalid = (field) => formik.touched[field] && formik.errors[field];
  const getErrorMessage = (field) =>
    isInvalid(field) && (
      <small className="p-error">{formik.errors[field]}</small>
    );

  return (
    <BlockUI blocked={isUpdatingTarget || isFetchingTarget}>
      <div className="card w-full">
        <form onSubmit={formik.handleSubmit} className="p-fluid">
          <div className="field">
            <label
              htmlFor="name"
              className={classNames({
                "p-error": isInvalid("name"),
              })}
            >
              Name
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
            size="small"
            label="Save"
            className="p-mt-2 w-2"
            loading={isUpdatingTarget}
          />
        </form>
      </div>
    </BlockUI>
  );
};

export default observer(FTVSettingsRename);
