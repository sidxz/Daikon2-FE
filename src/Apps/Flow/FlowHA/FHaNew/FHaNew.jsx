import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import React, { useContext, useEffect, useState } from "react";
import { FcExpired } from "react-icons/fc";
import { GiMolecule } from "react-icons/gi";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loading from "../../../../Library/Loading/Loading";
import SecHeading from "../../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../../RootStore";
import InputOrg from "../../../../Shared/InputEditors/InputOrg";
import { appColors } from "../../../../constants/colors";
import { HAIcon } from "../../icons/HAIcon";
import FHaNewBaseHitData from "./components/FHaNewBaseHitData/FHaNewBaseHitData";
import FHaNewHitPicker from "./components/FHaNewHitPicker/FHaNewHitPicker";

import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { toast } from "react-toastify";
import SmilesView from "../../../../Library/SmilesView/SmilesView";
import InputMultiOrg from "../../../../Shared/InputEditors/InputMultiOrg";
import { statusOptions } from "../constants/statusOptions";
import FHaNewMoleculePicker from "./components/FHaNewMoleculePicker/FHaNewMoleculePicker";
const FHANew = () => {
  const [searchParams] = useSearchParams();
  const encodedData = searchParams.get("data");
  let decodedData = null;
  if (encodedData) {
    const decodedDataString = atob(encodedData);
    decodedData = JSON.parse(decodedDataString);
  }
  const [baseHitData, setBaseHitData] = useState(decodedData);
  const [selectedMolecule, setSelectedMolecule] = useState(null);

  //console.log("FHANew -> baseHitData", baseHitData);

  // make sure screen and hits are prefetched

  const rootStore = useContext(RootStoreContext);
  const {
    fetchScreens,
    isScreenListCacheValid,
    screenList,
    isFetchingScreens,
  } = rootStore.screenStore;

  const { isAddingHa, addHa } = rootStore.haStore;

  const navigate = useNavigate();

  useEffect(() => {
    if (!isScreenListCacheValid) {
      fetchScreens();
    }
  }, [isScreenListCacheValid, fetchScreens]);

  const formik = useFormik({
    initialValues: {
      name: "",
      haType: "",
      legacyId: "",
      primaryOrgId: "",
      status: "ReadyForHA",
      description: "",
      participatingOrgs: [],
    },

    validate: (values) => {
      const errors = {};
      if (!values.name) errors.name = "Name is required.";
      if (!values.primaryOrgId)
        errors.primaryOrgId = "Organization is required.";
      // Additional validations can be added here
      return errors;
    },

    onSubmit: (newHa) => {
      if (baseHitData == null && selectedMolecule == null) {
        toast.error("Please select molecules before submitting.");
        return;
      }
      if (baseHitData != null || selectedMolecule != null) {
        let data = {};
        if (selectedMolecule == null) {
          {
            data = {
              ...newHa,
              ...baseHitData,
            };
          }
        } else {
          {
            data = {
              ...newHa,
            };
            data["compoundId"] = selectedMolecule.id;
            data["compoundSMILES"] = selectedMolecule.smilesCanonical;
          }
        }

        //console.log("FHANew -> data", data);
        //return;
        addHa(data).then(() => {
          formik.resetForm();
          navigate("/wf/ha/dash/all-projects/");
        });
      }
    },
  });

  // Helper functions for form validation and error messages
  const isInvalid = (field) => formik.touched[field] && formik.errors[field];
  const getErrorMessage = (field) =>
    isInvalid(field) && (
      <small className="p-error">{formik.errors[field]}</small>
    );

  if (isFetchingScreens) {
    return <Loading message="Fetching screens and hits..." />;
  }

  // Template for rendering a selected status option
  const statusOptionTemplate = (option) => {
    if (option) {
      return (
        <div className="flex align-items-center align-self-center gap-2">
          <div className="flex flex-column">{option.icon}</div>
          <div className="flex flex-column">{option.name}</div>
        </div>
      );
    }
  };

  const statusValueTemplate = (option) => {
    if (option === null) {
      return (
        <div className="flex align-items-center align-self-center gap-2">
          <div className="flex flex-column">
            <FcExpired />
          </div>
          <div className="flex flex-column">Status Not Set</div>
        </div>
      );
    }
    if (option) {
      return (
        <div className="flex align-items-center align-self-center gap-2">
          <div className="flex flex-column">{option.icon}</div>
          <div className="flex flex-column">{option.name}</div>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-column m-2 min-w-full fadein animation-duration-500 gap-1">
      <div className="flex w-full">
        <SecHeading
          svgIcon={<HAIcon size={"25em"} />}
          heading="New Hit Assessment"
          color={appColors.sectionHeadingBg.ha}
          displayHorizon={false}
        />
      </div>
      {selectedMolecule == null && (
        <>
          <div className="flex w-full border-1 border-50">
            <Divider align="left">
              <div className="inline-flex align-items-center gap-2">
                <div className="text-xl inline-flex align-items-center">
                  <GiMolecule />
                </div>

                <div className="text-xl inline-flex align-items-center">
                  Option 1 | Start with screening hits
                </div>
              </div>
            </Divider>
          </div>
          <div className="flex w-full  border-1 border-50">
            {baseHitData == null ? (
              <FHaNewHitPicker
                baseHitData={baseHitData}
                setBaseHitData={setBaseHitData}
              />
            ) : (
              <FHaNewBaseHitData baseHitData={baseHitData} />
            )}
          </div>{" "}
        </>
      )}
      {baseHitData == null && (
        <>
          <div className="flex w-full border-1 border-50">
            <Divider align="left">
              <div className="inline-flex align-items-center gap-2">
                <div className="text-xl inline-flex align-items-center">
                  <GiMolecule />
                </div>

                <div className="text-xl inline-flex align-items-center">
                  Option 2 | Start with a molecule from vault
                </div>
              </div>
            </Divider>
          </div>
          <div className="flex w-full border-1 border-50">
            <FHaNewMoleculePicker
              selectedMolecule={selectedMolecule}
              setSelectedMolecule={setSelectedMolecule}
            />
          </div>
        </>
      )}

      <div className="flex w-full border-1 border-50">
        <div className="flex w-3">
          <Divider align="center" type="solid">
            {selectedMolecule?.id && (
              <div
                className="flex flex-column gap-2 border-1 border-50 p-2 m-1 w-full"
                id={selectedMolecule.id}
                key={selectedMolecule.id}
              >
                <div className="flex text-lg align-items-center justify-content-center">
                  Selected Molecule
                </div>
                <div className="flex border-1 border-50">
                  <SmilesView
                    smiles={selectedMolecule.smilesCanonical}
                    subStructure={null}
                    width={150}
                    height={150}
                  />
                </div>
                <div className="flex flex-column gap-1">
                  <div className="flex">
                    <p className="text-lg m-0">{selectedMolecule.name}</p>
                  </div>
                  <div className="flex">
                    <p className="text-sm m-0">
                      Synonyms: {selectedMolecule.synonyms}
                    </p>
                  </div>
                  <div className="flex">
                    <p className="m-0 text-color-secondary">
                      Mol Mass (g/mol): {selectedMolecule.molecularWeight}
                    </p>
                  </div>
                  <div className="flex">
                    <p className="m-0 text-color-secondary">
                      TPSA (Å²): {selectedMolecule.tpsa}
                    </p>
                  </div>
                  <div className="flex">
                    <p className="m-0 text-color-secondary">
                      cLog P: {selectedMolecule.cLogP}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Divider>
        </div>
        <div className="flex w-9 p-4 m-4">
          <form onSubmit={formik.handleSubmit} className="p-fluid w-full">
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
            </div>

            <div className="field">
              <label
                htmlFor="primaryOrgId"
                className={classNames({
                  "p-error": isInvalid("primaryOrgId"),
                })}
              >
                Primary Organization
              </label>

              <InputOrg
                value={formik.values.primaryOrgId}
                onChange={formik.handleChange("primaryOrgId")}
                className={classNames({
                  "p-invalid": isInvalid("primaryOrgId"),
                })}
              />
              {getErrorMessage("primaryOrgId")}
            </div>

            <div className="field">
              <label
                htmlFor="participatingOrgs"
                className={classNames({
                  "p-error": isInvalid("participatingOrgs"),
                })}
              >
                Participating Organization
              </label>

              <InputMultiOrg
                value={formik.values.participatingOrgs}
                onChange={formik.handleChange("participatingOrgs")}
                className={classNames({
                  "p-invalid": isInvalid("participatingOrgs"),
                })}
              />
              {getErrorMessage("participatingOrgs")}
            </div>

            <div className="field">
              <label
                htmlFor="status"
                className={classNames({
                  "p-error": isInvalid("status"),
                })}
              >
                Status
              </label>
              <Dropdown
                id="status"
                optionLabel="name"
                optionValue="value"
                options={statusOptions}
                itemTemplate={statusOptionTemplate}
                valueTemplate={statusValueTemplate}
                value={formik.values.status}
                placeholder="Select a status"
                onChange={formik.handleChange}
                className={classNames({
                  "p-invalid": isInvalid("status"),
                })}
              />

              {getErrorMessage("status")}
            </div>

            <div className="field">
              <label
                htmlFor="description"
                className={classNames({
                  "p-error": isInvalid("description"),
                })}
              >
                HA Description
              </label>
              <InputTextarea
                id="description"
                answer="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                className={classNames({
                  "p-invalid": isInvalid("description"),
                })}
              />
            </div>

            <Button
              icon="icon icon-common icon-database-submit"
              type="submit"
              label="Create Hit Assessment"
              className="p-mt-2"
              loading={isAddingHa}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default observer(FHANew);
