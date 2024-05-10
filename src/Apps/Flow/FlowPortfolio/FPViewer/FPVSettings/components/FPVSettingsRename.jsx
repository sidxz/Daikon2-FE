import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import { BlockUI } from "primereact/blockui";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import React, { useContext } from "react";
import { RootStoreContext } from "../../../../../../RootStore";

const FPVSettingsRename = () => {
  const rootStore = useContext(RootStoreContext);

  const {
    renameProject,
    isRenamingProject,
    selectedProject,
    isFetchingProject,
  } = rootStore.projectStore;

  const formik = useFormik({
    initialValues: {
      name: selectedProject.name,
    },

    validate: (values) => {
      const errors = {};
      if (!values.name) errors.name = "Name is required.";
      return errors;
    },

    onSubmit: (newProject) => {
      var projectToSubmit = { ...selectedProject, ...newProject };
      renameProject(projectToSubmit);
    },
  });

  const isInvalid = (field) => formik.touched[field] && formik.errors[field];
  const getErrorMessage = (field) =>
    isInvalid(field) && (
      <small className="p-error">{formik.errors[field]}</small>
    );

  return (
    <BlockUI blocked={isRenamingProject || isFetchingProject}>
      <div className="card w-full">
        <form onSubmit={formik.handleSubmit} className="p-fluid">
          <div className="field">
            <label
              htmlFor="name"
              className={classNames({
                "p-error": isInvalid("name"),
              })}
            >
              Project Name
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
            loading={isRenamingProject}
          />
        </form>
      </div>
    </BlockUI>
  );
};

export default observer(FPVSettingsRename);
