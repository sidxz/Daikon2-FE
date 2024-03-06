import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import React, { useContext } from "react";
import { RootStoreContext } from "../../../../../../../RootStore";

const FSPhVHAddHit = ({ hitCollectionId, closeSideBar }) => {
  const rootStore = useContext(RootStoreContext);
  const { isAddingHit, addHit } = rootStore.hitStore;

  const formik = useFormik({
    initialValues: {
      library: "",
      librarySource: "",
      method: "",
      mic: "",
      iC50: "",
      clusterGroup: "",
      notes: "",
      moleculeName: "",
      requestedSMILES: "",
    },

    validate: (values) => {
      const errors = {};
      if (!values.requestedSMILES)
        errors.requestedSMILES = "SMILES is required.";
      // Additional validations can be added here
      return errors;
    },

    onSubmit: (hitToAdd) => {
      hitToAdd.hitCollectionId = hitCollectionId;
      addHit(hitToAdd).then(() => {
        closeSideBar();
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
            className={classNames({ "p-error": isInvalid("iC50") })}
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
            htmlFor="moleculeName"
            className={classNames({ "p-error": isInvalid("moleculeName") })}
          >
            Compound Name
          </label>
          <InputText
            id="moleculeName"
            value={formik.values.moleculeName}
            onChange={formik.handleChange}
            className={classNames({
              "p-invalid": isInvalid("moleculeName"),
            })}
          />
          {getErrorMessage("moleculeName")}
        </div>

        <div className="field">
          <label
            htmlFor="requestedSMILES"
            className={classNames({
              "p-error": isInvalid("requestedSMILES"),
            })}
          >
            Compound Structure (SMILES)
          </label>
          <InputText
            id="requestedSMILES"
            value={formik.values.requestedSMILES}
            onChange={formik.handleChange}
            className={classNames({
              "p-invalid": isInvalid("requestedSMILES"),
            })}
          />
          {getErrorMessage("requestedSMILES")}
        </div>

        <div className="flex justify-content-end">
          <Button
            icon="icon icon-common icon-database-submit"
            type="submit"
            label="Add to database"
            className="p-button-secondary p-button-sm"
            loading={isAddingHit}
          />
        </div>
      </form>
    </div>
  );
};

export default observer(FSPhVHAddHit);
