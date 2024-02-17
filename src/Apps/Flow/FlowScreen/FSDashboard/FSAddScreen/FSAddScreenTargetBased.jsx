import { useFormik } from "formik";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import React, { useContext } from "react";
import { RootStoreContext } from "../../../../../RootStore";
import { orgDropDownOptions } from "../../../../../Shared/FormEditors/OrgDropDown";
import { screeningMethods } from "../../shared/FSValues";

const FSAddScreenTargetBased = ({ closeSideBar }) => {
  const rootStore = useContext(RootStoreContext);

  const { addScreen, isAddingScreen } = rootStore.screenStore;

  const formik = useFormik({
    initialValues: {
      org: "",
      name: "",
      notes: "",
      method: "",
      screeningType: "target-based",
    },

    validate: (values) => {
      const errors = {};
      if (!values.method) errors.method = "Method is required.";
      if (!values.name) errors.name = "Name is required.";
      // Additional validations can be added here
      return errors;
    },

    onSubmit: (newScreen) => {
      console.log(newScreen);

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

  return (
    <>
      <div className="card w-full">
        <form onSubmit={formik.handleSubmit} className="p-fluid">
          <div className="field">
            <label
              htmlFor="name"
              className={classNames({
                "p-error": isInvalid("name"),
              })}
            >
              Name *
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
              htmlFor="org"
              className={classNames({
                "p-error": isInvalid("org"),
              })}
            >
              Screening Organization
            </label>

            <Dropdown
              value={formik.values.org}
              options={orgDropDownOptions}
              onChange={formik.handleChange("org")}
              optionLabel="name"
              placeholder="Select an org"
              filter
              showClear
              filterBy="name"
              className={classNames({
                "p-invalid": isInvalid("org"),
              })}
            />
            {getErrorMessage("org")}
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
              options={screeningMethods}
              value={formik.values.method}
              placeholder="Select a method"
              onChange={formik.handleChange}
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

export default FSAddScreenTargetBased;
