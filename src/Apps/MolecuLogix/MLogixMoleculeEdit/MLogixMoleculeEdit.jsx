import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Fieldset } from "primereact/fieldset";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Menu } from "primereact/menu";
import { classNames } from "primereact/utils";
import { useContext, useEffect, useState } from "react";
import { FcTreeStructure } from "react-icons/fc";
import { useNavigate, useParams } from "react-router-dom";
import JSMEditor from "../../../Library/JSME/JSMEditor";
import Loading from "../../../Library/Loading/Loading";
import NotFound from "../../../Library/NotFound/NotFound";
import SecHeading from "../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../RootStore";
import InputOrg from "../../../Shared/InputEditors/InputOrg";
import InputScientist from "../../../Shared/InputEditors/InputScientist";
import { AppRoleResolver } from "../../../Shared/VariableResolvers/AppRoleResolver";
import { appColors } from "../../../constants/colors";
import { MolecuLogixIcon } from "../Icons/MolecuLogixIcon";
import { MLogixAdminRoleName } from "../constants/roles";
import * as Helper from "./MLogixMoleculeEditHelper";

const MLogixMoleculeEdit = () => {
  const params = useParams();
  const navigate = useNavigate();
  const rootStore = useContext(RootStoreContext);

  const [showStructureEditor, setShowStructureEditor] = useState(false);

  const {
    fetchMolecule,
    isFetchingMolecule,
    selectedMolecule,
    updateMolecule,
    isUpdatingMolecule,
  } = rootStore.moleculeStore;

  useEffect(() => {
    if (selectedMolecule === undefined || selectedMolecule?.id !== params?.id) {
      fetchMolecule(params.id);
    }
  }, [params.id, fetchMolecule, selectedMolecule]);

  const { isUserInAnyOfRoles } = AppRoleResolver();

  console.log("selectedMolecule", selectedMolecule);

  const formik = useFormik({
    initialValues: {
      id: selectedMolecule?.id,
      ids: selectedMolecule?.ids,
      name: selectedMolecule?.name,
      requestedSMILES: selectedMolecule?.smiles,
      synonyms: selectedMolecule?.synonyms,
      disclosureNotes: selectedMolecule?.disclosureNotes,
      disclosureOrgId: selectedMolecule?.disclosureOrgId,
      disclosureReason: selectedMolecule?.disclosureReason,
      disclosureScientist: selectedMolecule?.disclosureScientist,
      disclosureSource: selectedMolecule?.disclosureSource,
      disclosureStage: selectedMolecule?.disclosureStage,
      structureDisclosedDate: selectedMolecule?.structureDisclosedDate,
      literatureReferences: selectedMolecule?.literatureReferences,
    },
    enableReinitialize: true,

    validate: (values) => {
      const errors = {};
      if (!values.name) errors.name = "Name is required.";
      if (!values.requestedSMILES)
        errors.requestedSMILES = "SMILES is required.";
      // Additional validations can be added here
      return errors;
    },

    onSubmit: (newMolecule) => {
      console.log("newMolecule", newMolecule);
      updateMolecule(newMolecule);
    },
  });

  // Helper functions for form validation and error messages
  const isInvalid = (field) => formik.touched[field] && formik.errors[field];
  const getErrorMessage = (field) =>
    isInvalid(field) && (
      <small className="p-error">{formik.errors[field]}</small>
    );

  if (isFetchingMolecule) {
    return <Loading message={"Fetching Molecule..."} />;
  }

  if (selectedMolecule) {
    if (isUserInAnyOfRoles([MLogixAdminRoleName])) {
      return (
        <div className="flex flex-column min-w-full fadein animation-duration-500">
          <div className="flex gap-2">
            <div className="flex">
              <Menu model={Helper.sidePanelItems(navigate, selectedMolecule)} />
            </div>
            <div className="flex flex-column w-full">
              <div className="flex">
                <BreadCrumb
                  model={Helper.breadCrumbItems(selectedMolecule, navigate)}
                />
              </div>
              <div className="flex w-full">
                <SecHeading
                  icon="icon icon-common icon-math"
                  heading={"Molecule - " + selectedMolecule.name}
                  color={appColors.sectionHeadingBg.screen}
                />
              </div>

              <div className="flex-column w-full gap-2">
                <form onSubmit={formik.handleSubmit} className="p-fluid">
                  <div className="flex w-full mt-2">
                    <Fieldset
                      className="w-full"
                      legend={
                        <>
                          <FcTreeStructure className="mr-2" />
                          Update Disclosure Information
                        </>
                      }
                    >
                      <div className="field">
                        <label
                          htmlFor="disclosureScientist"
                          className={classNames({
                            "p-error": isInvalid("disclosureScientist"),
                          })}
                        >
                          Disclosure Scientist
                        </label>
                        <InputScientist
                          id="disclosureScientist"
                          value={formik.values.disclosureScientist}
                          onChange={formik.handleChange}
                          className={classNames({
                            "p-invalid": isInvalid("disclosureScientist"),
                          })}
                        />
                        {getErrorMessage("disclosureScientist")}
                      </div>

                      <div className="field">
                        <label
                          htmlFor="disclosureOrgId"
                          className={classNames({
                            "p-error": isInvalid("disclosureOrgId"),
                          })}
                        >
                          Disclosure Organization
                        </label>
                        <InputOrg
                          id="disclosureOrgId"
                          value={formik.values.disclosureOrgId}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {getErrorMessage("disclosureOrgId")}
                      </div>
                      <div className="field">
                        <label
                          htmlFor="disclosureReason"
                          className={classNames({
                            "p-error": isInvalid("disclosureReason"),
                          })}
                        >
                          Disclosure Reason
                        </label>
                        <InputTextarea
                          id="disclosureReason"
                          value={formik.values.disclosureReason}
                          onChange={formik.handleChange}
                          className={classNames({
                            "p-invalid": isInvalid("disclosureReason"),
                          })}
                        />
                        {getErrorMessage("disclosureReason")}
                      </div>

                      <div className="field">
                        <label
                          htmlFor="disclosureSource"
                          className={classNames({
                            "p-error": isInvalid("disclosureSource"),
                          })}
                        >
                          Disclosure Source
                        </label>
                        <InputText
                          id="disclosureSource"
                          value={formik.values.disclosureSource}
                          onChange={formik.handleChange}
                          className={classNames({
                            "p-invalid": isInvalid("disclosureSource"),
                          })}
                        />
                        {getErrorMessage("disclosureSource")}
                      </div>

                      <div className="field">
                        <label
                          htmlFor="disclosureStage"
                          className={classNames({
                            "p-error": isInvalid("disclosureStage"),
                          })}
                        >
                          Disclosure Stage
                        </label>
                        <Dropdown
                          options={[
                            { label: "Screening", value: "Screening" },
                            {
                              label: "Hit Assessment (HA)",
                              value: "HA",
                            },
                            { label: "Hit to Lead (H2L)", value: "H2L" },
                            { label: "Lead Optimization (LO)", value: "LO" },
                            { label: "Selection Phase (SP)", value: "SP" },
                            {
                              label: "Investigational New Drug (IND)",
                              value: "IND",
                            },
                            { label: "Phase 1 (P1)", value: "P1" },
                          ]}
                          optionLabel="label"
                          optionValue="value"
                          placeholder="Select Stage"
                          id="disclosureStage"
                          value={formik.values.disclosureStage}
                          onChange={formik.handleChange}
                          className={classNames({
                            "p-invalid": isInvalid("disclosureStage"),
                          })}
                        />
                        {getErrorMessage("disclosureStage")}
                      </div>

                      <div className="field">
                        <label
                          htmlFor="structureDisclosedDate"
                          className={classNames({
                            "p-error": isInvalid("structureDisclosedDate"),
                          })}
                        >
                          Disclosure Date
                        </label>
                        <InputText
                          id="structureDisclosedDate"
                          type="date"
                          value={
                            formik.values.structureDisclosedDate
                              ? formik.values.structureDisclosedDate.split(
                                  "T"
                                )[0]
                              : ""
                          }
                          onChange={formik.handleChange}
                          className={classNames({
                            "p-invalid": isInvalid("structureDisclosedDate"),
                          })}
                        />
                        {getErrorMessage("structureDisclosedDate")}
                      </div>

                      <div className="field">
                        <label
                          htmlFor="disclosureNotes"
                          className={classNames({
                            "p-error": isInvalid("disclosureNotes"),
                          })}
                        >
                          Disclosure Notes
                        </label>
                        <InputTextarea
                          id="disclosureNotes"
                          type="text"
                          value={formik.values.disclosureNotes}
                          onChange={formik.handleChange}
                          className={classNames({
                            "p-invalid": isInvalid("disclosureNotes"),
                          })}
                        />
                        {getErrorMessage("disclosureNotes")}
                      </div>

                      <div className="field">
                        <label
                          htmlFor="literatureReferences"
                          className={classNames({
                            "p-error": isInvalid("literatureReferences"),
                          })}
                        >
                          Literature References
                        </label>
                        <InputTextarea
                          id="literatureReferences"
                          type="text"
                          value={formik.values.literatureReferences}
                          onChange={formik.handleChange}
                          className={classNames({
                            "p-invalid": isInvalid("literatureReferences"),
                          })}
                        />
                        {getErrorMessage("literatureReferences")}
                      </div>
                    </Fieldset>
                  </div>
                  <div className="flex w-full mt-2">
                    <Fieldset
                      className="w-full bg-yellow-50 border-1 border-yellow-400"
                      legend={
                        <>
                          <FcTreeStructure className="mr-2" />
                          Update General Information
                        </>
                      }
                    >
                      <p className="m-0 p-2">
                        Updating these settings will impact the general
                        information of the molecule.
                      </p>

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
                          htmlFor="synonyms"
                          className={classNames({
                            "p-error": isInvalid("synonyms"),
                          })}
                        >
                          Synonyms
                        </label>
                        <InputText
                          id="synonyms"
                          value={formik.values.synonyms}
                          onChange={formik.handleChange}
                          className={classNames({
                            "p-invalid": isInvalid("synonyms"),
                          })}
                        />
                        {getErrorMessage("synonyms")}
                      </div>
                    </Fieldset>
                  </div>

                  <div className="flex w-full  mt-2">
                    <Fieldset
                      className="w-full bg-red-50	border-1 border-red-400"
                      legend={
                        <>
                          <FcTreeStructure className="mr-2" />
                          Update SMILES
                        </>
                      }
                    >
                      <p className="m-0 p-2 text-red-900 font-bold">
                        CAUTION! The settings below are designed to modify core
                        molecule settings. <br />
                        Updating these settings will have broad implications,
                        impacting overall functionality, including re
                        registering the molecule in the molecular database,
                        among others.
                      </p>

                      <div className="field">
                        <label
                          htmlFor="requestedSMILES"
                          className={classNames({
                            "p-error": isInvalid("requestedSMILES"),
                          })}
                        >
                          SMILES *
                        </label>
                        <div className="flex">
                          <div className="flex w-full">
                            <InputTextarea
                              id="requestedSMILES"
                              answer="requestedSMILES"
                              value={formik.values.requestedSMILES}
                              onChange={formik.handleChange}
                              className={classNames({
                                "p-invalid": isInvalid("requestedSMILES"),
                              })}
                            />
                            {getErrorMessage("requestedSMILES")}
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
                    </Fieldset>
                  </div>
                  <div className="flex w-full m-1">
                    <Button
                      icon="icon icon-common icon-database-submit"
                      type="submit"
                      label="Save Changes"
                      className="p-mt-2 w-2"
                      loading={isUpdatingMolecule}
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
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <NotFound />;
    }
  }

  return <div>MLogixMoleculeEdit</div>;
};

export default observer(MLogixMoleculeEdit);
