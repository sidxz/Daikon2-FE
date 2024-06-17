import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputTextarea } from "primereact/inputtextarea";
import { Sidebar } from "primereact/sidebar";
import { classNames } from "primereact/utils";
import React, { useContext, useState } from "react";
import { RootStoreContext } from "../../../../../../RootStore";

const FPPVIProjectInfoDesc = () => {
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
      name: "IND",
      value: selectedProject.indDescription,
    },
    {
      name: "P1",
      value: selectedProject.p1Description,
    },
  ];

  const formik = useFormik({
    initialValues: {
      indDescription: selectedProject.indDescription,
      p1Description: selectedProject.p1Description,
    },
    enableReinitialize: true,
    validate: (values) => {
      const errors = {};
      // if (!values.priority) errors.priority = "Priority is required";
      // if (!values.probability) errors.probability = "Probability is required";
      return errors;
    },
    onSubmit: (pData) => {
      let newData = { ...selectedProject, ...pData };
      //console.log(newData);
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
        header={<h2>Post Portfolio Description & Notes</h2>}
        onHide={() => setVisible(false)}
      >
        <div className="card w-full">
          <form onSubmit={formik.handleSubmit} className="p-fluid">
            <div className="field">
              <label
                htmlFor="indDescription"
                className={classNames({
                  "p-error": isInvalid("indDescription"),
                })}
              >
                IND Description/Note
              </label>
              <InputTextarea
                id="indDescription"
                rows={7}
                value={formik.values.indDescription}
                onChange={formik.handleChange}
                className={classNames({
                  "p-invalid": isInvalid("indDescription"),
                })}
              />

              {getErrorMessage("indDescription")}
            </div>

            <div className="field">
              <label
                htmlFor="p1Description"
                className={classNames({
                  "p-error": isInvalid("p1Description"),
                })}
              >
                P1 Description/Note
              </label>
              <InputTextarea
                id="p1Description"
                value={formik.values.p1Description}
                onChange={formik.handleChange}
                rows={7}
                className={classNames({
                  "p-invalid": isInvalid("p1Description"),
                })}
              />
              {getErrorMessage("p1Description")}
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

export default observer(FPPVIProjectInfoDesc);
