import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import React, { useContext, useEffect } from "react";
import { RootStoreContext } from "../../../../../RootStore";
import InputOrg from "../../../../../Shared/InputEditors/InputOrg";
import { AppOrgResolver } from "../../../../../Shared/VariableResolvers/AppOrgResolver";
import { GlobalValuesResolver } from "../../../../../Shared/VariableResolvers/GlobalValuesResolver";
import InputAssociatedTarget from "../../shared/InputAssociatedTarget";

const FSDAddScreenTargetBased = ({ closeSideBar }) => {
  const rootStore = useContext(RootStoreContext);

  const {
    addScreen,
    isAddingScreen,
    fetchScreens,
    isFetchingScreen,
    isScreenListCacheValid,
  } = rootStore.screenStore;
  const {
    targetListRegistry,
    fetchTargets,
    isFetchingTargets,
    isTargetListCacheValid,
  } = rootStore.targetStore;

  const { getScreeningGlobals } = GlobalValuesResolver();
  const { getOrgNameById } = AppOrgResolver();

  useEffect(() => {
    if (!isTargetListCacheValid) {
      fetchTargets();
    }
    if (!isScreenListCacheValid) {
      fetchScreens();
    }
  }, [
    fetchTargets,
    isTargetListCacheValid,
    fetchScreens,
    isScreenListCacheValid,
  ]);

  const formik = useFormik({
    initialValues: {
      associatedTargets: {},
      targetToAssociate: "",
      primaryOrgName: "",
      primaryOrgId: "",
      name: "",
      notes: "",
      method: "",
      screenType: "target-based",
    },

    validate: (values) => {
      const errors = {};
      if (!values.method) errors.method = "Method is required.";
      if (!values.name) errors.name = "Name is required.";
      // Additional validations can be added here
      return errors;
    },

    onSubmit: (newScreen) => {
      newScreen.primaryOrgName = getOrgNameById(newScreen.primaryOrgId);

      const targetName = targetListRegistry.get(
        newScreen.targetToAssociate
      ).name;
      newScreen.associatedTargets = {
        [newScreen.targetToAssociate]: targetName,
      };
      addScreen(newScreen).then(() => {
        closeSideBar();
        formik.resetForm();
      });
    },
  });

  // Helper functions for form validation and error messages
  const isInvalid = (field) => formik.touched[field] && formik.errors[field];
  const getErrorMessage = (field) =>
    isInvalid(field) && (
      <small className="p-error">{formik.errors[field]}</small>
    );

  let suggestedName = () => {
    // first check the no of existing screens of the selected target
    const targetId = formik.values.targetToAssociate;
    const targetScreens = rootStore.screenStore.screenList.filter(
      (screen) => screen.associatedTargets && screen.associatedTargets[targetId]
    );
    const targetName = targetListRegistry.get(targetId)?.name;
    const suggestedName = `${targetName ? targetName : ""}-${
      targetScreens.length + 1
    }`;
    return suggestedName;
  };

  useEffect(() => {
    // This effect runs when formik.values.targetToAssociate changes
    if (formik.values.targetToAssociate) {
      // Call the suggestedName function to get the suggested name
      const suggested = suggestedName();

      // Update the formik values with the suggested name
      formik.setFieldValue("name", suggested, false); // The third parameter is "shouldValidate", you can set it as needed
    }
  }, [formik.values.targetToAssociate, formik.setFieldValue]); // Add formik.setFieldValue to the dependency array

  if (isFetchingTargets || isFetchingScreen) {
    return <div>Please wait...</div>;
  }

  return (
    <>
      <div className="card w-full">
        <form onSubmit={formik.handleSubmit} className="p-fluid">
          <div className="field">
            <label
              htmlFor="targetToAssociate"
              className={classNames({
                "p-error": isInvalid("targetToAssociate"),
              })}
            >
              Associated Target
            </label>

            <InputAssociatedTarget
              value={formik.values.targetToAssociate}
              onChange={formik.handleChange("targetToAssociate")}
              className={classNames({
                "p-invalid": isInvalid("targetToAssociate"),
              })}
            />
            {getErrorMessage("targetToAssociate")}
          </div>

          <div className="field">
            <label
              htmlFor="name"
              className={classNames({
                "p-error": isInvalid("name"),
              })}
            >
              Name *
              {formik.values.targetToAssociate && (
                <p className="text-xs text-gray-500">
                  A name suggestion has been generated following the established
                  naming conventions for screenings.
                </p>
              )}
            </label>
            <InputText
              id="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              className={classNames({
                "p-invalid": isInvalid("name"),
              })}
            />
          </div>

          <div className="field">
            <label
              htmlFor="primaryOrgName"
              className={classNames({
                "p-error": isInvalid("primaryOrgName"),
              })}
            >
              Screening Organization
            </label>

            <InputOrg
              value={formik.values.primaryOrgId}
              onChange={formik.handleChange("primaryOrgId")}
              className={classNames({
                "p-invalid": isInvalid("primaryOrgId"),
              })}
            />
            {getErrorMessage("primaryOrgId")}
          </div>

          <div className="field">
            <label
              htmlFor="method"
              className={classNames({
                "p-error": isInvalid("method"),
              })}
            >
              Method
            </label>
            <Dropdown
              id="method"
              optionLabel="name"
              answer="value"
              options={getScreeningGlobals().screeningMethods}
              value={formik.values.method}
              placeholder="Select a method"
              onChange={formik.handleChange}
              filter
              showClear
              filterBy="name"
              className={classNames({
                "p-invalid": isInvalid("method"),
              })}
            />

            {getErrorMessage("method")}
          </div>

          <div className="field">
            <label
              htmlFor="notes"
              className={classNames({
                "p-error": isInvalid("comment"),
              })}
            >
              Notes
            </label>
            <InputTextarea
              id="notes"
              answer="notes"
              value={formik.values.notes}
              onChange={formik.handleChange}
              className={classNames({
                "p-invalid": isInvalid("notes"),
              })}
            />
          </div>

          <Button
            icon="icon icon-common icon-database-submit"
            type="submit"
            label="Add Screen"
            className="p-mt-2"
            loading={isAddingScreen}
          />
        </form>
      </div>
    </>
  );
};

export default observer(FSDAddScreenTargetBased);
