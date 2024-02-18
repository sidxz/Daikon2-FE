import { useFormik } from "formik";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import React from "react";

const FSTbVHAddHit = ({
  selectedGene,
  isAddingEssentiality,
  addEssentiality,
  closeSidebar,
}) => {
  const formik = useFormik({
    initialValues: {
      library: "",
      librarySource: "",
      method: "",
      mic: "",
      iC50: "",
      clusterGroup: "",
      notes: "",
      initialCompoundStructure: "",
    },

    validate: (values) => {
      const errors = {};
      if (!values.initialCompoundStructure)
        errors.initialCompoundStructure =
          "initialCompoundStructure is required.";
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
            htmlFor="library"
            className={classNames({ "p-error": isInvalid("library") })}
          >
            Library
          </label>
          <InputText
            id="library"
            value={formik.values.library}
            onChange={formik.handleChange}
            className={classNames({
              "p-invalid": isInvalid("library"),
            })}
          />
          {getErrorMessage("library")}
        </div>

        <div className="field">
          <label
            htmlFor="librarySource"
            className={classNames({ "p-error": isInvalid("librarySource") })}
          >
            Library Source
          </label>
          <InputText
            id="librarySource"
            value={formik.values.librarySource}
            onChange={formik.handleChange}
            className={classNames({
              "p-invalid": isInvalid("librarySource"),
            })}
          />
          {getErrorMessage("librarySource")}
        </div>

        <div className="field">
          <label
            htmlFor="method"
            className={classNames({ "p-error": isInvalid("method") })}
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
            htmlFor="mic"
            className={classNames({ "p-error": isInvalid("mic") })}
          >
            MIC
          </label>
          <InputText
            id="mic"
            value={formik.values.mic}
            onChange={formik.handleChange}
            className={classNames({
              "p-invalid": isInvalid("mic"),
            })}
          />
          {getErrorMessage("mic")}
        </div>

        <div className="field">
          <label
            htmlFor="iC50"
            className={classNames({ "p-error": isInvalid("mic") })}
          >
            IC50
          </label>
          <InputText
            id="iC50"
            value={formik.values.iC50}
            onChange={formik.handleChange}
            className={classNames({
              "p-invalid": isInvalid("iC50"),
            })}
          />
          {getErrorMessage("iC50")}
        </div>

        <div className="field">
          <label
            htmlFor="clusterGroup"
            className={classNames({ "p-error": isInvalid("clusterGroup") })}
          >
            Cluster Group
          </label>
          <InputText
            id="clusterGroup"
            value={formik.values.clusterGroup}
            onChange={formik.handleChange}
            className={classNames({
              "p-invalid": isInvalid("clusterGroup"),
            })}
          />
          {getErrorMessage("clusterGroup")}
        </div>

        <div className="field">
          <label
            htmlFor="initialCompoundStructure"
            className={classNames({
              "p-error": isInvalid("initialCompoundStructure"),
            })}
          >
            Compound Structure (SMILES)
          </label>
          <InputText
            id="initialCompoundStructure"
            value={formik.values.initialCompoundStructure}
            onChange={formik.handleChange}
            className={classNames({
              "p-invalid": isInvalid("initialCompoundStructure"),
            })}
          />
          {getErrorMessage("initialCompoundStructure")}
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

export default FSTbVHAddHit;
