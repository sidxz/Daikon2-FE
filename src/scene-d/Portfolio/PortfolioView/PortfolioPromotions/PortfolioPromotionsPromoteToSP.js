import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { ProgressBar } from "primereact/progressbar";
import { classNames } from "primereact/utils";
import React, { useContext } from "react";
import { RootStoreContext } from "../../../../app/stores/rootStore";

const PortfolioPromotionsPromoteToSP = ({ closeSidebar }) => {
  // Accessing MobX Store
  const rootStore = useContext(RootStoreContext);
  const { loadingProject, selectedProject } = rootStore.projectStore;

  const { creatingSP, createSP } = rootStore.portfolioStore;

  const formik = useFormik({
    initialValues: {
      spStart: "",
      spDescription: "",
    },
    validate: (data) => {
      let errors = {};

      if (!data.spStart) {
        errors.spStart = "Promotion date  is required.";
      }

      return errors;
    },
    onSubmit: (data) => {
      data["id"] = selectedProject.id;

      createSP(data).then((res) => {
        if (res !== null) {
          closeSidebar();
          formik.resetForm();
        }
      });

      // history.push()
    },
  });

  const isFormFieldValid = (field) =>
    !!(formik.touched[field] && formik.errors[field]);
  const getFormErrorMessage = (field) => {
    return (
      isFormFieldValid(field) && (
        <small className="p-error">{formik.errors[field]}</small>
      )
    );
  };

  // Render form or progress bar based on loading state
  if (!creatingSP && !loadingProject) {
    return (
      <div className="flex flex-column w-full">
        <div>
          <div className="card w-full">
            <form onSubmit={formik.handleSubmit} className="p-fluid">
              <div className="field">
                <label
                  htmlFor="spStart"
                  className={classNames({
                    "p-error": isFormFieldValid("spStart"),
                  })}
                >
                  SP Start Date
                </label>

                <Calendar
                  id="spStart"
                  name="spStart"
                  value={formik.values.spStart}
                  onChange={formik.handleChange}
                  dateFormat="dd/mm/yy"
                  mask="99/99/9999"
                  showIcon
                  className={classNames({
                    "p-invalid": isFormFieldValid("spStart"),
                  })}
                />

                {getFormErrorMessage("spStart")}
              </div>

              <div className="field">
                <label
                  htmlFor="spDescription"
                  className={classNames({
                    "p-error": isFormFieldValid("spDescription"),
                  })}
                >
                  SP Description
                </label>
                <InputTextarea
                  id="spDescription"
                  answer="spDescription"
                  value={formik.values.spDescription}
                  onChange={formik.handleChange}
                  className={classNames({
                    "p-invalid": isFormFieldValid("spDescription"),
                  })}
                />
              </div>
              <div className="field">
                <Button
                  icon="icon icon-common icon-database-submit"
                  type="submit"
                  label="Promote to SP"
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

export default observer(PortfolioPromotionsPromoteToSP);
