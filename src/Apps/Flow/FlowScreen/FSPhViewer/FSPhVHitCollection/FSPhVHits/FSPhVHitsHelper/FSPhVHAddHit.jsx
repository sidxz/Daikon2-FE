import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import { useContext, useState } from "react";
import JSMEditor from "../../../../../../../Library/JSME/JSMEditor";
import { RootStoreContext } from "../../../../../../../RootStore";
import { MolecuLogixIcon } from "../../../../../../MolecuLogix/Icons/MolecuLogixIcon";

const concentrationUnits = [
  { label: "μM", value: "μM" },
  { label: "nM", value: "nM" },
  { label: "mM", value: "mM" },
  { label: "μg/mL", value: "μg/mL" },
  { label: "pM", value: "pM" },
];

const FSPhVHAddHit = ({ hitCollectionId, closeSideBar }) => {
  const rootStore = useContext(RootStoreContext);
  const { isAddingHit, addHit } = rootStore.hitStore;

  const [showStructureEditor, setShowStructureEditor] = useState(false);

  const formik = useFormik({
    initialValues: {
      moleculeName: "",
      requestedSMILES: "",
      library: "",
      librarySource: "",
      assayType: "",
      clusterGroup: "",

      mic: "",
      micUnit: "",
      micCondition: "",
      miC90: "",
      miC90Unit: "",
      miC90Condition: "",

      iC50: "",
      iC50Unit: "",
      eC50: "",
      eC50Unit: "",
      gI50: "",
      gI50Unit: "",

      kd: "",
      kdUnit: "",
      ki: "",
      kiUnit: "",

      lD50: "",
      lD50Unit: "",
      tgi: "",
      tgiUnit: "",

      pctInhibition: "",
      pctInhibitionConcentration: "",
      pctInhibitionConcentrationUnit: "",

      notes: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.moleculeName)
        errors.moleculeName = "Molecule Name is required.";
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

  const isInvalid = (field) => formik.touched[field] && formik.errors[field];
  const getErrorMessage = (field) =>
    isInvalid(field) && (
      <small className="p-error">{formik.errors[field]}</small>
    );

  const renderField = (id, label) => (
    <div className="field">
      <label htmlFor={id} className={classNames({ "p-error": isInvalid(id) })}>
        {label}
      </label>
      <InputText
        id={id}
        value={formik.values[id]}
        onChange={formik.handleChange}
        className={classNames({ "p-invalid": isInvalid(id) })}
      />
      {getErrorMessage(id)}
    </div>
  );

  const renderDropdown = (id, label, options) => (
    <div className="field">
      <label htmlFor={id} className={classNames({ "p-error": isInvalid(id) })}>
        {label}
      </label>
      <Dropdown
        id={id}
        value={formik.values[id]}
        options={options}
        onChange={(e) => formik.setFieldValue(id, e.value)}
        placeholder="Select Unit"
        className={classNames({ "p-invalid": isInvalid(id) })}
      />
      {getErrorMessage(id)}
    </div>
  );

  return (
    <div className="card w-full">
      <form onSubmit={formik.handleSubmit} className="p-fluid space-y-4">
        <h4>Compound Information</h4>
        {renderField("moleculeName", "Compound Name")}
        <div className="field">
          <label
            htmlFor="requestedSMILES"
            className={classNames({
              "p-error": isInvalid("requestedSMILES"),
            })}
          >
            Compound Structure (SMILES)
          </label>
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
          {getErrorMessage("requestedSMILES")}
        </div>

        <h4>Library Information</h4>
        {renderField("library", "Library")}
        {renderField("librarySource", "Library Source")}
        {renderField("assayType", "Assay Type")}

        <h4>Cluster Information</h4>
        {renderField("clusterGroup", "Cluster Group")}

        <h4>Potency Data</h4>
        {renderField("mic", "MIC")}
        {renderDropdown("micUnit", "MIC Unit", concentrationUnits)}
        {renderField("micCondition", "MIC Condition")}
        {renderField("miC90", "MIC90")}
        {renderDropdown("miC90Unit", "MIC90 Unit", concentrationUnits)}
        {renderField("miC90Condition", "MIC90 Condition")}
        {renderField("iC50", "IC50")}
        {renderDropdown("iC50Unit", "IC50 Unit", concentrationUnits)}
        {renderField("eC50", "EC50")}
        {renderDropdown("eC50Unit", "EC50 Unit", concentrationUnits)}
        {renderField("gI50", "GI50")}
        {renderDropdown("gI50Unit", "GI50 Unit", concentrationUnits)}

        <h4>Binding Affinity</h4>
        {renderField("kd", "Kd")}
        {renderDropdown("kdUnit", "Kd Unit", concentrationUnits)}
        {renderField("ki", "Ki")}
        {renderDropdown("kiUnit", "Ki Unit", concentrationUnits)}

        <h4>Toxicity</h4>
        {renderField("lD50", "LD50")}
        {renderDropdown("lD50Unit", "LD50 Unit", concentrationUnits)}
        {renderField("tgi", "TGI")}
        {renderDropdown("tgiUnit", "TGI Unit", concentrationUnits)}

        <h4>Inhibition Metrics</h4>
        {renderField("pctInhibition", "% Inhibition")}
        {renderField("pctInhibitionConcentration", "% Inh Conc")}
        {renderDropdown(
          "pctInhibitionConcentrationUnit",
          "% Inh Conc Unit",
          concentrationUnits
        )}

        <h4>Other Details</h4>
        {renderField("notes", "Notes")}

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

      <Dialog
        visible={showStructureEditor}
        closable={false}
        modal={false}
        showHeader={false}
        onHide={() => setShowStructureEditor(false)}
        style={{ width: "52rem", height: "44rem", overflow: "hidden" }}
        pt={{ content: { style: { overflow: "hidden" } } }}
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
    </div>
  );
};

export default observer(FSPhVHAddHit);
