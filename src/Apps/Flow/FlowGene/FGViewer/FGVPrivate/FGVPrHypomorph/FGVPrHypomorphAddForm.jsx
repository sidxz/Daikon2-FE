import { useFormik } from "formik";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import React from "react";
import InputTextAreaDVar from "../../../../../../Shared/DVarEditors/InputTextAreaDVar";
import InputTextDVar from "../../../../../../Shared/DVarEditors/InputTextDVar";
import { generateDefaultDVar } from "../../../../../../Shared/DVariable/DVarDefaults";

const FGVPrHypomorphAddForm = ({
  selectedGene,
  isAddingHypomorph,
  addHypomorph,
  closeSidebar,
}) => {
  const formik = useFormik({
    initialValues: {
      knockdownStrain: generateDefaultDVar(),
      phenotype: generateDefaultDVar(),
      growthDefect: generateDefaultDVar(),
      growthDefectSeverity: generateDefaultDVar(),
      notes: generateDefaultDVar(),
      knockdownLevel: generateDefaultDVar(),

      estimatedKnockdownRelativeToWT: generateDefaultDVar(),
      estimateBasedOn: generateDefaultDVar(),
      selectivelySensitizesToOnTargetInhibitors: generateDefaultDVar(),
      suitableForScreening: generateDefaultDVar(),
    },

    validate: (values) => {
      const errors = {};
      if (!values.knockdownStrain)
        //errors.knockdownStrain = "Knockdown Strain is required.";
        // Additional validations can be added here
        return errors;
    },

    onSubmit: (hypomorph) => {
      hypomorph.geneId = selectedGene.id;
      addHypomorph(hypomorph).then(() => {
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
            htmlFor="knockdownStrain"
            className={classNames({ "p-error": isInvalid("knockdownStrain") })}
          >
            Knockdown strain
          </label>
          <InputTextAreaDVar
            id="knockdownStrain"
            formik={formik}
            className={classNames({
              "p-invalid": isInvalid("knockdownStrain"),
            })}
          />

          {getErrorMessage("knockdownStrain")}
        </div>

        <div className="field">
          <label
            htmlFor="phenotype"
            className={classNames({
              "p-error": isInvalid("phenotype"),
            })}
          >
            Phenotype
          </label>
          <InputTextAreaDVar
            id="phenotype"
            formik={formik}
            className={classNames({
              "p-invalid": isInvalid("phenotype"),
            })}
          />
          {getErrorMessage("phenotype")}
        </div>

        <div className="field">
          <label
            htmlFor="growthDefect"
            className={classNames({
              "p-error": isInvalid("growthDefect"),
            })}
          >
            Growth defect
          </label>
          <InputTextAreaDVar
            id="growthDefect"
            formik={formik}
            className={classNames({
              "p-invalid": isInvalid("growthDefect"),
            })}
          />
          {getErrorMessage("growthDefect")}
        </div>

        <div className="field">
          <label
            htmlFor="growthDefectSeverity"
            className={classNames({
              "p-error": isInvalid("growthDefectSeverity"),
            })}
          >
            Growth defect severity
          </label>
          <InputTextDVar
            id="growthDefectSeverity"
            formik={formik}
            className={classNames({
              "p-invalid": isInvalid("growthDefectSeverity"),
            })}
          />
          {getErrorMessage("growthDefectSeverity")}
        </div>

        <div className="field">
          <label
            htmlFor="knockdownLevel"
            className={classNames({
              "p-error": isInvalid("knockdownLevel"),
            })}
          >
            knockdownLevel
          </label>
          <InputTextDVar
            id="knockdownLevel"
            formik={formik}
            className={classNames({
              "p-invalid": isInvalid("knockdownLevel"),
            })}
          />
          {getErrorMessage("knockdownLevel")}
        </div>

        <div className="field">
          <label
            htmlFor="estimatedKnockdownRelativeToWT"
            className={classNames({
              "p-error": isInvalid("estimatedKnockdownRelativeToWT"),
            })}
          >
            Estimated knockdown relative to WT
          </label>
          <InputTextDVar
            id="estimatedKnockdownRelativeToWT"
            formik={formik}
            className={classNames({
              "p-invalid": isInvalid("estimatedKnockdownRelativeToWT"),
            })}
          />
          {getErrorMessage("estimatedKnockdownRelativeToWT")}
        </div>

        <div className="field">
          <label
            htmlFor="estimateBasedOn"
            className={classNames({
              "p-error": isInvalid("estimateBasedOn"),
            })}
          >
            Estimate based on
          </label>
          <InputTextDVar
            id="estimateBasedOn"
            formik={formik}
            className={classNames({
              "p-invalid": isInvalid("estimateBasedOn"),
            })}
          />
          {getErrorMessage("estimateBasedOn")}
        </div>

        <div className="field">
          <label
            htmlFor="selectivelySensitizesToOnTargetInhibitors"
            className={classNames({
              "p-error": isInvalid("selectivelySensitizesToOnTargetInhibitors"),
            })}
          >
            Selectively sensitizes to OnTargetInhibitors
          </label>
          <InputTextDVar
            id="selectivelySensitizesToOnTargetInhibitors"
            formik={formik}
            className={classNames({
              "p-invalid": isInvalid(
                "selectivelySensitizesToOnTargetInhibitors"
              ),
            })}
          />
          {getErrorMessage("selectivelySensitizesToOnTargetInhibitors")}
        </div>

        <div className="field">
          <label
            htmlFor="suitableForScreening"
            className={classNames({
              "p-error": isInvalid("suitableForScreening"),
            })}
          >
            Suitable for screening
          </label>
          <InputTextDVar
            id="suitableForScreening"
            formik={formik}
            className={classNames({
              "p-invalid": isInvalid("suitableForScreening"),
            })}
          />
          {getErrorMessage("suitableForScreening")}
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
            loading={isAddingHypomorph}
          />
        </div>
      </form>
    </div>
  );
};

export default FGVPrHypomorphAddForm;
