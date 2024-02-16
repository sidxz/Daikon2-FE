import { useFormik } from "formik";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import React from "react";

const FGVPrProteinActivityAssayAddForm = ({
  selectedGene,
  isAddingProteinActivityAssay,
  addProteinActivityAssay,
  closeSidebar,
}) => {
  const formik = useFormik({
    initialValues: {
      assay: "",
      method: "",
      pmid: "",
      url: "",
      reference: "",
      throughput: "",
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
          <InputTextarea
            id="assay"
            value={formik.values.assay}
            onChange={formik.handleChange}
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
            htmlFor="throughput"
            className={classNames({
              "p-error": isInvalid("throughput"),
            })}
          >
            Throughput
          </label>
          <InputText
            id="throughput"
            value={formik.values.throughput}
            onChange={formik.handleChange}
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
          <InputTextarea
            id="reference"
            value={formik.values.reference}
            onChange={formik.handleChange}
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
