import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import React, { useContext, useState } from "react";
import JSMEditor from "../../../Library/JSME/JSMEditor";
import { RootStoreContext } from "../../../RootStore";
import { MolecuLogixIcon } from "../Icons/MolecuLogixIcon";

const MLogixRegisterMolecule = ({ closeSideBar }) => {
  const rootStore = useContext(RootStoreContext);

  const { registerMolecule, isRegisteringMolecule } = rootStore.moleculeStore;

  const [showStructureEditor, setShowStructureEditor] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      SMILES: "",
    },

    validate: (values) => {
      const errors = {};
      if (!values.name) errors.name = "Name is required.";
      if (!values.SMILES) errors.SMILES = "SMILES is required.";
      // Additional validations can be added here
      return errors;
    },

    onSubmit: (newMolecule) => {
      registerMolecule(newMolecule).then(() => {
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
    <>
      <div className="card w-full">
        <form onSubmit={formik.handleSubmit} className="p-fluid">
          <div className="field">
            <label
              htmlFor="name"
              className={classNames({
                "p-error": isInvalid("name"),
              })}
            >
              Name *
            </label>
            <InputText
              id="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              className={classNames({
                "p-invalid": isInvalid("name"),
              })}
            />
            {getErrorMessage("name")}
          </div>

          <div className="field">
            <label
              htmlFor="SMILES"
              className={classNames({
                "p-error": isInvalid("SMILES"),
              })}
            >
              SMILES *
            </label>
            <div className="flex">
              <div className="flex w-full">
                <InputTextarea
                  id="SMILES"
                  answer="SMILES"
                  value={formik.values.SMILES}
                  onChange={formik.handleChange}
                  className={classNames({
                    "p-invalid": isInvalid("SMILES"),
                  })}
                />
                {getErrorMessage("SMILES")}
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
          </div>

          <Button
            icon="icon icon-common icon-database-submit"
            type="submit"
            label="Register Molecule"
            className="p-mt-2"
            loading={isRegisteringMolecule}
          />
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
              initialSmiles={formik.values.SMILES}
              onSave={(s) => {
                setShowStructureEditor(false);
                formik.setFieldValue("SMILES", s);
              }}
            />
          </div>
        </Dialog>
      </div>
    </>
  );
};

export default observer(MLogixRegisterMolecule);
