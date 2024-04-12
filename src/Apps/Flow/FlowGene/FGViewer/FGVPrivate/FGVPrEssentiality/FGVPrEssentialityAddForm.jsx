import { useFormik } from "formik";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import React from "react";

const FGVPrEssentialityAddForm = ({
  selectedGene,
  isAddingEssentiality,
  addEssentiality,
  closeSidebar,
}) => {
  const classificationOptions = [
    { name: "Essential", value: "Essential" },
    { name: "Essential-Domain", value: "Essential-Domain" },
    { name: "Growth-Advantage", value: "Growth-Advantage" },
    { name: "Growth-Defect", value: "Growth-Defect" },
    { name: "Non-Essential", value: "Non-Essential" },
    { name: "Uncertain", value: "Uncertain" },
  ];

  const formik = useFormik({
    initialValues: {
      classification: "",
      condition: "",
      strain: "",
      method: "",
      reference: "",
      note: "",
    },

    validate: (values) => {
      const errors = {};
      if (!values.classification)
        errors.classification = "Classification is required.";
      // Additional validations can be added here
      return errors;
    },

    onSubmit: (essentiality) => {
      essentiality.geneId = selectedGene.id;
      addEssentiality(essentiality).then(() => {
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
            htmlFor="classification"
            className={classNames({ "p-error": isInvalid("classification") })}
          >
            Classification *
          </label>
          <Dropdown
            id="classification"
            value={formik.values.classification}
            options={classificationOptions}
            onChange={formik.handleChange}
            placeholder="Select a classification"
            optionLabel="name"
            autoFocus
            className={classNames({ "p-invalid": isInvalid("classification") })}
          />
          {getErrorMessage("classification")}
        </div>

        <div className="field">
          <label
            htmlFor="condition"
            className={classNames({
              "p-error": isInvalid("condition"),
            })}
          >
            Condition
          </label>
          <InputTextarea
            id="condition"
            value={formik.values.condition}
            onChange={formik.handleChange}
            className={classNames({
              "p-invalid": isInvalid("condition"),
            })}
          />
          {getErrorMessage("condition")}
        </div>

        <div className="field">
          <label
            htmlFor="strain"
            className={classNames({
              "p-error": isInvalid("strain"),
            })}
          >
            Strain
          </label>
          <InputText
            id="strain"
            value={formik.values.strain}
            onChange={formik.handleChange}
            className={classNames({
              "p-invalid": isInvalid("strain"),
            })}
          />
          {getErrorMessage("strain")}
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
          <InputText
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
            htmlFor="reference"
            className={classNames({
              "p-error": isInvalid("reference"),
            })}
          >
            Reference
          </label>
          <InputText
            id="reference"
            value={formik.values.reference}
            onChange={formik.handleChange}
            className={classNames({
              "p-invalid": isInvalid("reference"),
            })}
          />
          {getErrorMessage("reference")}
        </div>

        <div className="field">
          <label
            htmlFor="note"
            className={classNames({
              "p-error": isInvalid("note"),
            })}
          >
            Notes
          </label>
          <InputTextarea
            id="note"
            value={formik.values.notes}
            onChange={formik.handleChange}
            className={classNames({
              "p-invalid": isInvalid("note"),
            })}
          />
          {getErrorMessage("note")}
        </div>

        <div className="flex justify-content-end">
          <Button
            icon="icon icon-common icon-database-submit"
            type="submit"
            label="Add to database"
            className="p-button-secondary p-button-sm"
            loading={isAddingEssentiality}
          />
        </div>
      </form>
    </div>
  );
};

export default FGVPrEssentialityAddForm;
