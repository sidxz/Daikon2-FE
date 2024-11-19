import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import React, { useContext, useState } from "react";
import JSMEditor from "../../../../../../Library/JSME/JSMEditor";
import LoadingBlockUI from "../../../../../../Library/LoadingBlockUI/LoadingBlockUI";
import { RootStoreContext } from "../../../../../../RootStore";
import { MolecuLogixIcon } from "../../../../../MolecuLogix/Icons/MolecuLogixIcon";
const HaCompoundEvolutionAdd = ({ hitAssessmentId, closeSideBar }) => {
  const rootStore = useContext(RootStoreContext);
  const { isAddingHaCEvo, addHaCEvo } = rootStore.haCompoundEvoStore;

  const [showStructureEditor, setShowStructureEditor] = useState(false);

  const formik = useFormik({
    initialValues: {
      moleculeName: "",
      requestedSMILES: "",
      evolutionDate: new Date(),
      notes: "",
      mic: null,
      iC50: null,
    },

    validate: (values) => {
      const errors = {};
      if (!values.moleculeName)
        errors.moleculeName = "Molecule Name is required.";
      if (!values.requestedSMILES)
        errors.requestedSMILES = "SMILES is required.";
      // Additional validations can be added here
      return errors;
    },

    onSubmit: (cEvoToAdd) => {
      cEvoToAdd.hitAssessmentId = hitAssessmentId;
      console.log(cEvoToAdd);
      //return;
      addHaCEvo(cEvoToAdd);
      closeSideBar();
      formik.resetForm();
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
      <LoadingBlockUI loading={isAddingHaCEvo}>
        <form onSubmit={formik.handleSubmit} className="p-fluid">
          <div className="field">
            <label
              htmlFor="moleculeName"
              className={classNames({ "p-error": isInvalid("moleculeName") })}
            >
              Molecule Name
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

          <div className="flex">
            <div className="flex w-full">
              <InputTextarea
                id="requestedSMILES"
                value={formik.values.requestedSMILES}
                onChange={formik.handleChange}
                className={classNames({
                  "p-invalid": isInvalid("requestedSMILES"),
                })}
              />
            </div>
            <div className="flex border-1 border-50 p-2">
              <Button
                text
                type="button"
                icon={<MolecuLogixIcon size={32} />}
                label="Structure Editor"
                onClick={() => setShowStructureEditor(true)}
              />
            </div>
          </div>

          <div className="field">
            <label
              htmlFor="evolutionDate"
              className={classNames({
                "p-error": isInvalid("evolutionDate"),
              })}
            >
              Evolution Date
            </label>
            <Calendar
              id="evolutionDate"
              name="evolutionDate"
              value={formik.values.evolutionDate}
              onChange={formik.handleChange}
              dateFormat="dd/mm/yy"
              mask="99/99/9999"
              showIcon
              className={classNames({
                "p-invalid": isInvalid("evolutionDate"),
              })}
            />

            {getErrorMessage("evolutionDate")}
          </div>

          <div className="field">
            <label
              htmlFor="mic"
              className={classNames({ "p-error": isInvalid("mic") })}
            >
              MIC (µM)
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
              IC50 (µM)
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
              loading={isAddingHaCEvo}
            />
          </div>
        </form>
        <Dialog
          visible={showStructureEditor}
          closable={false}
          modal={false}
          showHeader={false}
          onHide={() => setShowStructureEditor(false)}
          style={{
            width: "52rem",
            height: "44rem",
            overflow: "hidden !important",
          }}
          pt={{
            content: { style: { overflow: "hidden" } },
          }}
        >
          <div className="flex pt-5" style={{ overflow: "hidden" }}>
            <JSMEditor
              initialSmiles={formik.values.requestedSMILES}
              onSave={(s) => {
                setShowStructureEditor(false);
                formik.setFieldValue("requestedSMILES", s);
              }}
            />
          </div>
        </Dialog>
      </LoadingBlockUI>
    </div>
  );
};

export default observer(HaCompoundEvolutionAdd);
