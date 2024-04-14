import { useFormik } from "formik";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import React from "react";
import { generateDefaultDVar } from "../../../../../../Shared/DVariable/DVarDefaults";
import InputTextAreaDVar from "../../../../../../Shared/DVarEditors/InputTextAreaDVar";
import InputTextDVar from "../../../../../../Shared/DVarEditors/InputTextDVar";
import CalendarDVar from "../../../../../../Shared/DVarEditors/CalendarDVar";

const FGVPrProteinProductionAddForm = ({
  selectedGene,
  isAddingProteinProduction,
  addProteinProduction,
  closeSidebar,
}) => {
  const formik = useFormik({
    initialValues: {
      production: generateDefaultDVar(),
      method: generateDefaultDVar(),
      dateProduced: generateDefaultDVar(),
      pmid: generateDefaultDVar(),
      url: generateDefaultDVar(),
      notes: generateDefaultDVar(),
      purity: generateDefaultDVar(),
    },

    validate: (values) => {
      const errors = {};
      if (!values.production) errors.production = "Production is required.";
      // Additional validations can be added here
      return errors;
    },

    onSubmit: (proteinProduction) => {
      proteinProduction.geneId = selectedGene.id;
      addProteinProduction(proteinProduction).then(() => {
        closeSidebar();
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
    <div className="card w-full">
      <form onSubmit={formik.handleSubmit} className="p-fluid">
        <div className="field">
          <label
            htmlFor="production"
            className={classNames({ "p-error": isInvalid("production") })}
          >
            Production *
          </label>
          <InputTextAreaDVar
            id="production"
            formik={formik}
            className={classNames({
              "p-invalid": isInvalid("production"),
            })}
          />

          {getErrorMessage("production")}
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
          <InputTextAreaDVar
            id="method"
            formik={formik}
            className={classNames({
              "p-invalid": isInvalid("method"),
            })}
          />
          {getErrorMessage("method")}
        </div>

        <div className="field">
          <label
            htmlFor="dateProduced"
            className={classNames({
              "p-error": isInvalid("dateProduced"),
            })}
          >
            Date Produced
          </label>
          <CalendarDVar
            id="dateProduced"
            formik={formik}
            className={classNames({
              "p-invalid": isInvalid("dateProduced"),
            })}
          />
          {getErrorMessage("dateProduced")}
        </div>

        <div className="field">
          <label
            htmlFor="pmid"
            className={classNames({
              "p-error": isInvalid("pmid"),
            })}
          >
            PMID
          </label>
          <InputTextDVar
            id="pmid"
            formik={formik}
            className={classNames({
              "p-invalid": isInvalid("pmid"),
            })}
          />
          {getErrorMessage("pmid")}
        </div>

        <div className="field">
          <label
            htmlFor="url"
            className={classNames({
              "p-error": isInvalid("url"),
            })}
          >
            URL
          </label>
          <InputTextDVar
            id="url"
            formik={formik}
            className={classNames({
              "p-invalid": isInvalid("url"),
            })}
          />
          {getErrorMessage("url")}
        </div>

        <div className="field">
          <label
            htmlFor="purity"
            className={classNames({
              "p-error": isInvalid("purity"),
            })}
          >
            Purity
          </label>
          <InputTextDVar
            id="purity"
            formik={formik}
            className={classNames({
              "p-invalid": isInvalid("purity"),
            })}
          />
          {getErrorMessage("purity")}
        </div>

        <div className="field">
          <label
            htmlFor="notes"
            className={classNames({
              "p-error": isInvalid("notes"),
            })}
          >
            Notes
          </label>
          <InputTextAreaDVar
            id="notes"
            formik={formik}
            className={classNames({
              "p-invalid": isInvalid("notes"),
            })}
          />
          {getErrorMessage("notes")}
        </div>

        <div className="flex justify-content-end">
          <Button
            icon="icon icon-common icon-database-submit"
            type="submit"
            label="Add to database"
            className="p-button-secondary p-button-sm"
            loading={isAddingProteinProduction}
          />
        </div>
      </form>
    </div>
  );
};

export default FGVPrProteinProductionAddForm;
