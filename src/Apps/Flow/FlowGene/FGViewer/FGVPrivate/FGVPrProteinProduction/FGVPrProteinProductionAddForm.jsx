import { useFormik } from "formik";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import React from "react";

const FGVPrProteinProductionAddForm = ({
  selectedGene,
  isAddingProteinProduction,
  addProteinProduction,
  closeSidebar,
}) => {
  const formik = useFormik({
    initialValues: {
      production: "",
      method: "",
      dateProduced: "",
      pmid: "",
      url: "",
      notes: "",
      purity: "",
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
          <InputTextarea
            id="production"
            value={formik.values.production}
            onChange={formik.handleChange}
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
          <InputTextarea
            id="method"
            value={formik.values.method}
            onChange={formik.handleChange}
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
          <Calendar
            id="dateProduced"
            value={formik.values.dateProduced}
            onChange={(e) => formik.setFieldValue("dateProduced", e.value)}
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
          <InputText
            id="pmid"
            value={formik.values.pmid}
            onChange={formik.handleChange}
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
          <InputText
            id="url"
            value={formik.values.url}
            onChange={formik.handleChange}
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
          <InputText
            id="purity"
            value={formik.values.purity}
            onChange={formik.handleChange}
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
          <InputTextarea
            id="notes"
            value={formik.values.notes}
            onChange={formik.handleChange}
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
