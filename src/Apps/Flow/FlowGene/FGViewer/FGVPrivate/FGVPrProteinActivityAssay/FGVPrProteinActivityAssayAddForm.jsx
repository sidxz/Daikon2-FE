import { useFormik } from "formik";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import React from "react";
import InputTextAreaDVar from "../../../../../../Shared/DVarEditors/InputTextAreaDVar";
import InputTextDVar from "../../../../../../Shared/DVarEditors/InputTextDVar";
import { generateDefaultDVar } from "../../../../../../Shared/DVariable/DVarDefaults";

const FGVPrProteinActivityAssayAddForm = ({
  selectedGene,
  isAddingProteinActivityAssay,
  addProteinActivityAssay,
  closeSidebar,
}) => {
  const formik = useFormik({
    initialValues: {
      assay: generateDefaultDVar(),
      method: generateDefaultDVar(),
      pmid: generateDefaultDVar(),
      url: generateDefaultDVar(),
      reference: generateDefaultDVar(),
      throughput: generateDefaultDVar(),
    },

    validate: (values) => {
      const errors = {};
      if (!values.assay) errors.assay = "Assay is required.";
      // Additional validations can be added here
      return errors;
    },

    onSubmit: (proteinActivityAssay) => {
      proteinActivityAssay.geneId = selectedGene.id;
      addProteinActivityAssay(proteinActivityAssay).then(() => {
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
            htmlFor="assay"
            className={classNames({ "p-error": isInvalid("assay") })}
          >
            Assay *
          </label>
          <InputTextAreaDVar
            id="assay"
            formik={formik}
            className={classNames({
              "p-invalid": isInvalid("assay"),
            })}
          />

          {getErrorMessage("assay")}
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
            htmlFor="throughput"
            className={classNames({
              "p-error": isInvalid("throughput"),
            })}
          >
            Throughput
          </label>
          <InputTextDVar
            id="throughput"
            formik={formik}
            className={classNames({
              "p-invalid": isInvalid("throughput"),
            })}
          />
          {getErrorMessage("throughput")}
        </div>

        <div className="field">
          <label
            htmlFor="reference"
            className={classNames({
              "p-error": isInvalid("reference"),
            })}
          >
            Reference
          </label>
          <InputTextAreaDVar
            id="reference"
            formik={formik}
            className={classNames({
              "p-invalid": isInvalid("reference"),
            })}
          />
          {getErrorMessage("reference")}
        </div>

        <div className="flex justify-content-end">
          <Button
            icon="icon icon-common icon-database-submit"
            type="submit"
            label="Add to database"
            className="p-button-secondary p-button-sm"
            loading={isAddingProteinActivityAssay}
          />
        </div>
      </form>
    </div>
  );
};

export default FGVPrProteinActivityAssayAddForm;
