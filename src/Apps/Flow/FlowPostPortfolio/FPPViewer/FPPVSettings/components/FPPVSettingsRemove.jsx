import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { SelectButton } from "primereact/selectbutton";
import { classNames } from "primereact/utils";
import React, { useContext } from "react";
import { FcCancel, FcOk } from "react-icons/fc";
import { RootStoreContext } from "../../../../../../RootStore";

const FPVSettingsRemove = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    fetchProject,
    selectedProject,
    isFetchingProject,
    isProjectRegistryCacheValid,
    updateProject,
    isUpdatingProject,
  } = rootStore.projectStore;

  const formik = useFormik({
    initialValues: {
      isProjectRemoved: selectedProject?.isProjectRemoved || false,
      projectRemovedDate: selectedProject?.projectRemovedDate || new Date(),
    },

    validate: (values) => {
      const errors = {};
      //if (!values.isProjectRemoved) errors.method = "Selection is required.";
      // Additional validations can be added here
      return errors;
    },

    onSubmit: (newProject) => {
      var projectToSubmit = { ...selectedProject, ...newProject };
      console.log(projectToSubmit);
      updateProject(projectToSubmit);
      //renameTarget(targetToSubmit);
    },
  });
  // Helper functions for form validation and error messages
  const isInvalid = (field) => formik.touched[field] && formik.errors[field];
  const getErrorMessage = (field) =>
    isInvalid(field) && (
      <small className="p-error">{formik.errors[field]}</small>
    );

  const options = [
    { icon: <FcOk />, value: false, name: "Active" },
    { icon: <FcCancel />, value: true, name: "Removed" },
  ];

  const template = (option) => {
    return (
      <div className="flex gap-2 align-items-center justify-content-center">
        {option.icon} {option.name}
      </div>
    );
  };

  return (
    <div className="card w-full">
      <form onSubmit={formik.handleSubmit} className="p-fluid">
        <div className="field">
          <label
            htmlFor="isProjectRemoved"
            className={classNames({
              "p-error": isInvalid("isProjectRemoved"),
            })}
          >
            Project Status
          </label>
          <SelectButton
            id="isProjectRemoved"
            value={formik.values.isProjectRemoved}
            onChange={(e) => formik.setFieldValue("isProjectRemoved", e.value)}
            itemTemplate={template}
            optionLabel="value"
            options={options}
            optionValue="value"
            disabled={isUpdatingProject}
          />

          {getErrorMessage("isProjectRemoved")}
        </div>

        <Button
          icon="icon icon-common icon-database-submit"
          type="submit"
          size="small"
          severity="danger"
          label="Save"
          className="p-mt-2 w-2"
          loading={isUpdatingProject}
        />
      </form>
    </div>
  );
};

export default observer(FPVSettingsRemove);
