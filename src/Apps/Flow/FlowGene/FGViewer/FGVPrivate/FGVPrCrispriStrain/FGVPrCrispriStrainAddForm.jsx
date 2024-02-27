import { useFormik } from "formik";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import React from "react";

const FGVPrCrispriStrainAddForm = ({
  selectedGene,
  isAddingCrispriStrain,
  addCrispriStrain,
  closeSidebar,
}) => {
  const formik = useFormik({
    initialValues: {
      crispriStrainName: "",
      notes: "",
    },

    validate: (values) => {
      const errors = {};
      if (!values.crispriStrainName)
        errors.crispriStrainName = "Crispri Strain Name is required.";
      // Additional validations can be added here
      return errors;
    },

    onSubmit: (crispriStrain) => {
      crispriStrain.geneId = selectedGene.id;
      addCrispriStrain(crispriStrain).then(() => {
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
            htmlFor="crispriStrainName"
            className={classNames({
              "p-error": isInvalid("crispriStrainName"),
            })}
          >
            Crispri Strain Name *
          </label>
          <InputTextarea
            id="crispriStrainName"
            value={formik.values.crispriStrainName}
            onChange={formik.handleChange}
            className={classNames({
              "p-invalid": isInvalid("crispriStrainName"),
            })}
          />

          {getErrorMessage("crispriStrainName")}
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
            loading={isAddingCrispriStrain}
          />
        </div>
      </form>
    </div>
  );
};

export default FGVPrCrispriStrainAddForm;
