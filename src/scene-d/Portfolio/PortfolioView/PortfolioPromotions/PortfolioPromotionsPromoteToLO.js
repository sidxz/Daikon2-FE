import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { ProgressBar } from "primereact/progressbar";
import { classNames } from "primereact/utils";
import React, { useContext } from "react";
import { RootStoreContext } from "../../../../app/stores/rootStore";

// Component for promoting a portfolio to LO
const PortfolioPromotionsPromoteToLO = ({ closeSidebar }) => {
  // Accessing MobX Store
  const rootStore = useContext(RootStoreContext);
  const { loadingProject, selectedProject } = rootStore.projectStore;

  const { creatingLO, createLO } = rootStore.portfolioStore;

  // Initialize Formik for form management
  const formik = useFormik({
    initialValues: {
      loStart: "",
      loDescription: "",
    },
    validate: (data) => {
      let errors = {};

      if (!data.loStart) {
        errors.loStart = "Promotion date  is required.";
      }

      return errors;
    },
    onSubmit: (data) => {
      data["id"] = selectedProject.id;

      // Create LO and handle result
      createLO(data).then((res) => {
        if (res !== null) {
          closeSidebar();
          formik.resetForm();
        }
      });

      // history.push()
    },
  });

  // Check if form field is valid
  const isFormFieldValid = (field) =>
    !!(formik.touched[field] && formik.errors[field]);

  // Get form field error message
  const getFormErrorMessage = (field) => {
    return (
      isFormFieldValid(field) && (
        <small className="p-error">{formik.errors[field]}</small>
      )
    );
  };

  // Render form or progress bar based on state
  if (!creatingLO && !loadingProject) {
    return (
      <div className="flex flex-column w-full">
        <div>
          <div className="card w-full">
            <form onSubmit={formik.handleSubmit} className="p-fluid">
              {/* LO Start Date Field */}
              <div className="field">
                <label
                  htmlFor="loStart"
                  className={classNames({
                    "p-error": isFormFieldValid("loStart"),
                  })}
                >
                  LO Start Date
                </label>

                <Calendar
                  id="loStart"
                  name="loStart"
                  value={formik.values.loStart}
                  onChange={formik.handleChange}
                  dateFormat="dd/mm/yy"
                  mask="99/99/9999"
                  showIcon
                  className={classNames({
                    "p-invalid": isFormFieldValid("loStart"),
                  })}
                />

                {getFormErrorMessage("loStart")}
              </div>

              {/* LO Description Field */}
              <div className="field">
                <label
                  htmlFor="loDescription"
                  className={classNames({
                    "p-error": isFormFieldValid("loDescription"),
                  })}
                >
                  LO Description
                </label>
                <InputTextarea
                  id="loDescription"
                  answer="loDescription"
                  value={formik.values.loDescription}
                  onChange={formik.handleChange}
                  className={classNames({
                    "p-invalid": isFormFieldValid("loDescription"),
                  })}
                />
              </div>
              {/* Submit Button */}
              <div className="field">
                <Button
                  icon="icon icon-common icon-database-submit"
                  type="submit"
                  label="Promote to LO"
                  className="p-mt-2"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return <ProgressBar mode="indeterminate" style={{ height: "6px" }} />;
};

export default observer(PortfolioPromotionsPromoteToLO);
