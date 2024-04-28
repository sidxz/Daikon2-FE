import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Sidebar } from "primereact/sidebar";
import { classNames } from "primereact/utils";
import React, { useContext, useState } from "react";
import LoadingBlockUI from "../../../../../../Library/LoadingBlockUI/LoadingBlockUI";
import { RootStoreContext } from "../../../../../../RootStore";
import PostPortfolioPriorityGauge from "../../../shared/PostPortfolioPriorityGauge";
import PostPortfolioProbabilityGauge from "../../../shared/PostPortfolioProbabilityGauge";

const FPPVIProjectInfoPriority = () => {
  const rootStore = useContext(RootStoreContext);
  const [visible, setVisible] = useState(false);
  const {
    selectedProject,
    isFetchingProject,
    updateProject,
    isUpdatingProject,
  } = rootStore.projectStore;

  const formik = useFormik({
    initialValues: {
      priority: selectedProject.priority,
      priorityNote: selectedProject.priorityNote,
      probability: selectedProject.probability,
      probabilityNote: selectedProject.probabilityNote,
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
      <div className="flex flex-column">
        <div className="table-header flex flex-row w-full shadow-0 fadein">
          <div className="flex justify-content-end w-full">
            <div className="flex flex-grow min-w-max">
              <Button
                type="button"
                icon="pi pi-plus"
                label="Set"
                className="p-button-text p-button-sm"
                onClick={() => setVisible(true)}
              />
            </div>
          </div>
        </div>

        <div className="flex w-full gap-1">
          <div className="flex flex-column">
            <div className="flex">
              <PostPortfolioPriorityGauge
                priority={selectedProject?.priority}
              />
            </div>
            <div className="flex max-w-17rem p-2 m-2 text-left border-1 border-50">
              {selectedProject?.priorityNote}
            </div>
          </div>

          <div className="flex flex-column">
            <div className="flex">
              <PostPortfolioProbabilityGauge
                probability={selectedProject?.probability}
              />
            </div>
            <div className="flex max-w-17rem p-2 m-2 text-left border-1 border-50">
              {selectedProject?.probabilityNote}
            </div>
          </div>
        </div>
      </div>
      <Sidebar
        visible={visible}
        position="right"
        header={<h2>Team Settings</h2>}
        onHide={() => setVisible(false)}
      >
        <LoadingBlockUI blocked={isUpdatingProject}>
          <div className="card w-full">
            <form onSubmit={formik.handleSubmit} className="p-fluid">
              <div className="field">
                <label
                  htmlFor="priority"
                  className={classNames({
                    "p-error": isInvalid("priority"),
                  })}
                >
                  Priority
                </label>
                <Dropdown
                  id="priority"
                  value={formik.values.priority}
                  options={["High", "Medium", "Low"]}
                  onChange={formik.handleChange}
                  placeholder="Select Priority"
                />

                {getErrorMessage("priority")}
              </div>

              <div className="field">
                <label
                  htmlFor="priorityNote"
                  className={classNames({
                    "p-error": isInvalid("priorityNote"),
                  })}
                >
                  Priority Note
                </label>
                <InputTextarea
                  id="priorityNote"
                  value={formik.values.priorityNote}
                  onChange={formik.handleChange}
                  className={classNames({
                    "p-invalid": isInvalid("priorityNote"),
                  })}
                />

                {getErrorMessage("priorityNote")}
              </div>

              <div className="field">
                <label
                  htmlFor="probability"
                  className={classNames({
                    "p-error": isInvalid("probability"),
                  })}
                >
                  Probability
                </label>
                <Dropdown
                  id="probability"
                  value={formik.values.probability}
                  options={["High", "Medium", "Low"]}
                  onChange={formik.handleChange}
                  placeholder="Select Probability"
                />
                {getErrorMessage("probability")}
              </div>
              <div className="field">
                <label
                  htmlFor="probabilityNote"
                  className={classNames({
                    "p-error": isInvalid("probabilityNote"),
                  })}
                >
                  Probability Note
                </label>
                <InputTextarea
                  id="probabilityNote"
                  value={formik.values.probabilityNote}
                  onChange={formik.handleChange}
                  className={classNames({
                    "p-invalid": isInvalid("probabilityNote"),
                  })}
                />

                {getErrorMessage("probabilityNote")}
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
        </LoadingBlockUI>
      </Sidebar>
    </>
  );
};

export default observer(FPPVIProjectInfoPriority);
