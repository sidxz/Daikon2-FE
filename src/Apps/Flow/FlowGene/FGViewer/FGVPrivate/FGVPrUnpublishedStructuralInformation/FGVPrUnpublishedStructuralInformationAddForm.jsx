import { useFormik } from "formik";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import React from "react";
import InputTextAreaDVar from "../../../../../../Shared/DVarEditors/InputTextAreaDVar";
import OrgEditorDVar from "../../../../../../Shared/DVarEditors/OrgEditorDVar";
import { generateDefaultDVar } from "../../../../../../Shared/DVariable/DVarDefaults";

const FGVPrUnpublishedStructuralInformationAddForm = ({
  selectedGene,
  isAddingUnpublishedStructuralInformation,
  addUnpublishedStructuralInformation,
  closeSidebar,
}) => {
  const formik = useFormik({
    initialValues: {
      organization: generateDefaultDVar(),
      method: generateDefaultDVar(),
      resolution: generateDefaultDVar(),
      ligands: generateDefaultDVar(),
      url: generateDefaultDVar(),
      reference: generateDefaultDVar(),
      researcher: generateDefaultDVar(),
    },

    validate: (values) => {
      const errors = {};
      if (!values.organization)
        errors.organization = "Organization is required.";
      // Additional validations can be added here
      return errors;
    },

    onSubmit: (unpublishedStructuralInformation) => {
      unpublishedStructuralInformation.geneId = selectedGene.id;
      addUnpublishedStructuralInformation(
        unpublishedStructuralInformation
      ).then(() => {
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
            htmlFor="organization"
            className={classNames({ "p-error": isInvalid("organization") })}
          >
            Organization *
          </label>
          <OrgEditorDVar
            id="organization"
            formik={formik}
            placeholder="Select a organization"
            optionLabel="name"
            autoFocus
            className={classNames({ "p-invalid": isInvalid("organization") })}
          />
          {getErrorMessage("organization")}
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
            htmlFor="resolution"
            className={classNames({
              "p-error": isInvalid("resolution"),
            })}
          >
            Resolution
          </label>
          <InputTextAreaDVar
            id="resolution"
            formik={formik}
            className={classNames({
              "p-invalid": isInvalid("resolution"),
            })}
          />
          {getErrorMessage("resolution")}
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
          <InputTextAreaDVar
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
            htmlFor="ligands"
            className={classNames({
              "p-error": isInvalid("ligands"),
            })}
          >
            Ligands
          </label>
          <InputTextAreaDVar
            id="ligands"
            formik={formik}
            className={classNames({
              "p-invalid": isInvalid("ligands"),
            })}
          />
          {getErrorMessage("ligands")}
        </div>

        <div className="field">
          <label
            htmlFor="researcher"
            className={classNames({
              "p-error": isInvalid("researcher"),
            })}
          >
            Researcher
          </label>
          <InputTextAreaDVar
            id="researcher"
            formik={formik}
            className={classNames({
              "p-invalid": isInvalid("researcher"),
            })}
          />
          {getErrorMessage("researcher")}
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
            loading={isAddingUnpublishedStructuralInformation}
          />
        </div>
      </form>
    </div>
  );
};

export default FGVPrUnpublishedStructuralInformationAddForm;
