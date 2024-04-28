import { useFormik } from "formik";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputTextarea } from "primereact/inputtextarea";
import { Sidebar } from "primereact/sidebar";
import { classNames } from "primereact/utils";
import React, { useContext, useState } from "react";
import { RootStoreContext } from "../../../../../../RootStore";

const FPVIProjectInfoDesc = () => {
  const rootStore = useContext(RootStoreContext);
  const [visible, setVisible] = useState(false);
  const {
    selectedProject,
    isFetchingProject,
    updateProject,
    isUpdatingProject,
  } = rootStore.projectStore;

  let projectDescData = [
    {
      name: "H2L Description",
      value: selectedProject.h2LDescription,
    },
    {
      name: "LO Description",
      value: selectedProject.loDescription,
    },
    {
      name: "SP Description",
      value: selectedProject.spDescription,
    },
  ];

  const formik = useFormik({
    initialValues: {
      h2LDescription: selectedProject.h2LDescription,
      loDescription: selectedProject.loDescription,
      spDescription: selectedProject.spDescription,
    },
    validate: (values) => {
      const errors = {};
      // if (!values.priority) errors.priority = "Priority is required";
      // if (!values.probability) errors.probability = "Probability is required";
      return errors;
    },
    onSubmit: (pData) => {
      let newData = { ...selectedProject, ...pData };
      console.log(newData);
      updateProject(newData).then(() => {
        setVisible(false);
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
      <div className="flex flex-column min-w-full border-0">
        <div className="table-header flex flex-row w-full shadow-0 fadein">
          <div className="flex justify-content-end w-full">
            <div className="flex flex-grow min-w-max">
              <Button
                type="button"
                icon="pi pi-plus"
                label="Edit"
                className="p-button-text p-button-sm"
                onClick={() => setVisible(true)}
              />
            </div>
          </div>
        </div>
        <div className="flex w-full gap-1">
          <DataTable
            value={projectDescData}
            className="HideDataTableHeader w-full"
          >
            <Column field="name"></Column>
            <Column
              field="value"
              body={(rowData) => {
                if (!rowData?.value) {
                  return (
                    <div className="w-full">
                      A description/note has not been provided.{" "}
                      <span
                        className="text-primary"
                        onClick={() => setVisible(true)}
                      >
                        Click Here
                      </span>{" "}
                      to set.
                    </div>
                  );
                }
                return <div>{rowData.value}</div>;
              }}
            ></Column>
          </DataTable>
        </div>
      </div>

      <Sidebar
        visible={visible}
        position="right"
        header={<h2>Portfolio Description & Notes</h2>}
        onHide={() => setVisible(false)}
      >
        <div className="card w-full">
          <form onSubmit={formik.handleSubmit} className="p-fluid">
            <div className="field">
              <label
                htmlFor="h2LDescription"
                className={classNames({
                  "p-error": isInvalid("h2LDescription"),
                })}
              >
                H2L Description/Note
              </label>
              <InputTextarea
                id="h2LDescription"
                rows={7}
                value={formik.values.h2LDescription}
                onChange={formik.handleChange}
                className={classNames({
                  "p-invalid": isInvalid("h2LDescription"),
                })}
              />

              {getErrorMessage("h2LDescription")}
            </div>

            <div className="field">
              <label
                htmlFor="loDescription"
                className={classNames({
                  "p-error": isInvalid("loDescription"),
                })}
              >
                LO Description/Note
              </label>
              <InputTextarea
                id="loDescription"
                value={formik.values.loDescription}
                onChange={formik.handleChange}
                rows={7}
                className={classNames({
                  "p-invalid": isInvalid("loDescription"),
                })}
              />
              {getErrorMessage("loDescription")}
            </div>

            <div className="field">
              <label
                htmlFor="spDescription"
                className={classNames({
                  "p-error": isInvalid("spDescription"),
                })}
              >
                SP Description/Note
              </label>
              <InputTextarea
                id="spDescription"
                value={formik.values.spDescription}
                onChange={formik.handleChange}
                rows={7}
                className={classNames({
                  "p-invalid": isInvalid("spDescription"),
                })}
              />
              {getErrorMessage("spDescription")}
            </div>

            <div className="flex justify-content-end">
              <Button
                icon="icon icon-common icon-database-submit"
                type="submit"
                label="Save"
                className="p-button-secondary p-button-sm"
                loading={isUpdatingProject}
              />
            </div>
          </form>
        </div>
      </Sidebar>
    </>
  );
};

export default FPVIProjectInfoDesc;
