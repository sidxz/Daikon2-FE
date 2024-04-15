import { useFormik } from "formik";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import React from "react";
import InputTextAreaDVar from "../../../../../../Shared/DVarEditors/InputTextAreaDVar";
import { generateDefaultDVar } from "../../../../../../Shared/DVariable/DVarDefaults";
import { orgDropDownOptions } from "../../../../../../Shared/FormEditors/OrgDropDown";

const FGVPrResistanceMutationAddForm = ({
  selectedGene,
  isAddingResistanceMutation,
  addResistanceMutation,
  closeSidebar,
}) => {
  const formik = useFormik({
    initialValues: {
      mutation: generateDefaultDVar(),
      isolate: generateDefaultDVar(),
      parentStrain: generateDefaultDVar(),
      organization: generateDefaultDVar(),
      compound: generateDefaultDVar(),
      researcher: generateDefaultDVar(),
      notes: generateDefaultDVar(),
      reference: generateDefaultDVar(),
      shiftInMIC: generateDefaultDVar(),
    },

    validate: (values) => {
      const errors = {};
      if (!values.mutation) errors.mutation = "Mutation is required.";
      // Additional validations can be added here
      return errors;
    },

    onSubmit: (resistanceMutation) => {
      resistanceMutation.geneId = selectedGene.id;
      addResistanceMutation(resistanceMutation).then(() => {
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
            htmlFor="mutation"
            className={classNames({ "p-error": isInvalid("mutation") })}
          >
            Mutation *
          </label>
          <InputTextAreaDVar
            id="mutation"
            formik={formik}
            className={classNames({
              "p-invalid": isInvalid("mutation"),
            })}
          />

          {getErrorMessage("mutation")}
        </div>

        <div className="field">
          <label
            htmlFor="isolate"
            className={classNames({
              "p-error": isInvalid("isolate"),
            })}
          >
            Isolate
          </label>
          <InputTextAreaDVar
            id="isolate"
            formik={formik}
            className={classNames({
              "p-invalid": isInvalid("isolate"),
            })}
          />
          {getErrorMessage("isolate")}
        </div>

        <div className="field">
          <label
            htmlFor="parentStrain"
            className={classNames({
              "p-error": isInvalid("parentStrain"),
            })}
          >
            Parent Strain
          </label>
          <InputTextAreaDVar
            id="parentStrain"
            formik={formik}
            className={classNames({
              "p-invalid": isInvalid("parentStrain"),
            })}
          />
          {getErrorMessage("parentStrain")}
        </div>

        <div className="field">
          <label
            htmlFor="compound"
            className={classNames({
              "p-error": isInvalid("compound"),
            })}
          >
            Compound
          </label>
          <InputTextAreaDVar
            id="compound"
            formik={formik}
            className={classNames({
              "p-invalid": isInvalid("compound"),
            })}
          />
          {getErrorMessage("compound")}
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
            htmlFor="organization"
            className={classNames({ "p-error": isInvalid("organization") })}
          >
            Organization *
          </label>
          <Dropdown
            id="organization"
            value={formik.values.organization}
            options={orgDropDownOptions}
            onChange={formik.handleChange}
            placeholder="Select a organization"
            optionLabel="name"
            autoFocus
            className={classNames({ "p-invalid": isInvalid("organization") })}
          />
          {getErrorMessage("organization")}
        </div>

        <div className="field">
          <label
            htmlFor="shiftInMIC"
            className={classNames({
              "p-error": isInvalid("shiftInMIC"),
            })}
          >
            Shift In MIC
          </label>
          <InputTextAreaDVar
            id="shiftInMIC"
            formik={formik}
            className={classNames({
              "p-invalid": isInvalid("shiftInMIC"),
            })}
          />
          {getErrorMessage("shiftInMIC")}
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
            loading={isAddingResistanceMutation}
          />
        </div>
      </form>
    </div>
  );
};

export default FGVPrResistanceMutationAddForm;
