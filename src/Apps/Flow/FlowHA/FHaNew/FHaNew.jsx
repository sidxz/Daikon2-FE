import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FcExpired } from "react-icons/fc";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loading from "../../../../Library/Loading/Loading";
import SecHeading from "../../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../../RootStore";
import { appColors } from "../../../../constants/colors";
import { HAIcon } from "../../icons/HAIcon";

import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";

import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Panel } from "primereact/panel";
import { classNames } from "primereact/utils";
import { toast } from "react-toastify";
import SmilesView from "../../../../Library/SmilesView/SmilesView";
import InputMultiOrg from "../../../../Shared/InputEditors/InputMultiOrg";
import InputOrg from "../../../../Shared/InputEditors/InputOrg";
import { AppOrgResolver } from "../../../../Shared/VariableResolvers/AppOrgResolver";
import StepperNavButtons from "../../../../UILib/StepperTools/NavButtons/StepperNavButtons";
import { statusOptions } from "../constants/statusOptions";
import FHaNewHitPicker from "./components/FHaNewHitPicker/FHaNewHitPicker";
import FHaNewMoleculePicker from "./components/FHaNewMoleculePicker/FHaNewMoleculePicker";
const FHANew = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const encodeData = (data) => btoa(JSON.stringify(data));
  const decodeData = (encodedData) => {
    try {
      return JSON.parse(atob(encodedData));
    } catch (error) {
      console.error("Failed to decode data:", error);
      return null;
    }
  };

  const { getOrgNameById } = AppOrgResolver();

  const [screenSectionData, setScreenSectionData] = useState({
    selectedScreen: null,
    selectedHitCollection: null,
    selectedBaseHits: null,
    selectedPrimaryHit: null,
  });

  const [baseHitData, setBaseHitData] = useState(null);
  const [selectedMolecule, setSelectedMolecule] = useState(null);
  const [selectedAssocMethod, setSelectedAssocMethod] = useState(null);

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
  const stepperRef = useRef(null);

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
      if (!values.name.trim()) {
        errors.name = "Name is required.";
      }

      if (!values.primaryOrgId)
        errors.primaryOrgId = "Primary Organization is required.";
      // Additional validations can be added here
      return errors;
    },
    validateOnBlur: true,
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

  const nomenclatureForm = (
    <div className="flex w-9 flex-column gap-2">
      <div className="flex text-2xl">Naming and Describing Your Project</div>
      <div className="flex text-base">
        To start, give your project a clear and meaningful name that reflects
        its purpose or objective. A good name will make it easier to identify
        the project later.
      </div>
      <form className="p-fluid w-full">
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
            onBlur={formik.handleBlur}
            className={classNames({
              "p-invalid": isInvalid("name"),
            })}
          />
          {getErrorMessage("name")}
        </div>

        <div className="field">
          <label
            htmlFor="description"
            className={classNames({
              "p-error": isInvalid("description"),
            })}
          >
            Provide a brief explanation of the project's goal or scope.
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

        <div className="field">
          <label
            htmlFor="primaryOrgId"
            className={classNames({
              "p-error": isInvalid("primaryOrgId"),
            })}
          >
            Primary Organization* : This is the main organization responsible
            for the project.
          </label>

          <InputOrg
            id="primaryOrgId"
            value={formik.values.primaryOrgId}
            onChange={formik.handleChange("primaryOrgId")}
            onBlur={formik.handleBlur}
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
            Participating Organization : Include any other organizations
            collaborating on the project.
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
            Status : A project typically starts as "Ready for HA," or "Active"
            if Hit Assessment is already underway.
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
      </form>
      <StepperNavButtons
        stepperRef={stepperRef}
        showBack={false}
        nextDisabled={formik.values.name === "" || isInvalid("name")}
      />
    </div>
  );

  const associationPanel = (
    <div className="flex w-full">
      <div className="flex w-full gap-2 justify-content-center border-0">
        <div className="flex flex-column w-9 gap-2">
          <div className="flex flex-column  border-round border-0 border-1 p-2">
            <div className="flex text-2xl">Guidelines for Association</div>
            <div className="flex text-base">
              A Hit Assessment is typically associated with a specific screen,
              specifically a primary compound and a set of related compounds
              from the hit list of the screen.
            </div>
            <div className="flex text-base">
              On this page, you have three approaches to proceed:
            </div>
          </div>

          <div className="flex justify-content-center align-items-stretch line-height-3 gap-2">
            {/* Box 1 */}
            <Button
              className="flex flex-column w-4 bg-surface border-round p-2 border-1 border-50 p-button-outlined"
              severity="secondary"
              onClick={() => {
                stepperRef.current.nextCallback();
                setSelectedAssocMethod("screen");
              }}
            >
              <div className="flex-grow-1 flex align-items-center justify-content-center">
                <div className="text-base text-center">
                  <p className="text-xl font-semibold">Start with a Screen</p>
                  If you already know the relevant screen, you can begin by
                  selecting it and then navigate to choose a compound from the
                  associated hit list.
                </div>
              </div>
            </Button>
            {/* Box 2 */}
            <Button
              className="flex flex-column w-4 bg-surface border-round p-2 border-1 border-50 p-button-outlined"
              severity="secondary"
              onClick={() => {
                stepperRef.current.nextCallback();
                setSelectedAssocMethod("compound");
              }}
            >
              <div className="flex-grow-1 flex align-items-center justify-content-center">
                <div className="text-base text-center">
                  <p className="text-xl font-semibold">Start with a Compound</p>
                  If you know the compound, you can search for all screens
                  linked to that compound and then select the appropriate screen
                  for your assessment.
                </div>
              </div>
            </Button>
            {/* Box 3 */}
            <Button
              className="flex flex-column w-4 bg-surface border-round p-2 border-1 border-50 p-button-outlined"
              severity="secondary"
              onClick={() => {
                stepperRef.current.nextCallback();
                setSelectedAssocMethod("startWithBlankTemplate");
              }}
            >
              <div className="flex-grow-1 flex align-items-center justify-content-center">
                <div className="text-base text-center">
                  <p className="text-xl font-semibold">
                    Unknown/Undisclosed Compound
                  </p>
                  If the compound is unknown you can skip selecting a compound.
                  However, as a best practice, linking helps Daikon maintain a
                  hyperlinked and queryable workflow.
                </div>
              </div>
            </Button>
          </div>
          <StepperNavButtons stepperRef={stepperRef} showNext={false} />
        </div>
      </div>
    </div>
  );

  const startWithScreenPanel = (
    <div className="flex w-full gap-2">
      <FHaNewHitPicker
        screenSectionData={screenSectionData}
        setScreenSectionData={setScreenSectionData}
        baseHitData={baseHitData}
        setBaseHitData={setBaseHitData}
        stepperRef={stepperRef}
      />
    </div>
  );

  const startWithCompoundPanel = (
    <div className="flex w-full gap-2">
      <FHaNewMoleculePicker
        selectedMolecule={selectedMolecule}
        setSelectedMolecule={setSelectedMolecule}
        baseHitData={baseHitData}
        setBaseHitData={setBaseHitData}
        stepperRef={stepperRef}
      />
    </div>
  );

  const startWithBlankTemplate = (
    <div className="flex flex-column w-full gap-4 justify-content-center align-content-center">
      <div className="flex text-2xl bg-red-700 p-2 border-1 border-50 border-round-md text-white">
        Compound Selection Skipped. What does this mean?
      </div>
      <div className="flex text-lg p-2 surface-ground	border-1 border-50 border-round-md">
        You have chosen to skip compound selection. This means you will proceed
        without linking a specific compound or a screen/hit list to your Hit
        Assessment. While this is valid, we recommend linking a compound
        whenever possible to keep your workflow interactive and easy to search
        within Daikon. If this Hit Assessment is based on a screen that has not
        been created yet, please create the screen first. If the compound is
        undisclosed or unknown, and the screen is also not known, you may
        proceed with creating the Hit Assessment without linking a compound.
      </div>
      <StepperNavButtons
        stepperRef={stepperRef}
        nextLabel="Acknowledge & Continue"
      />
    </div>
  );

  const generateSummaryData = () => {
    let summary = [];

    // Add form values
    if (formik.values.name)
      summary.push({ name: "Project Name", value: formik.values.name });
    if (formik.values.description)
      summary.push({ name: "Description", value: formik.values.description });
    if (formik.values.primaryOrgId)
      summary.push({
        name: "Primary Org",
        value: getOrgNameById(formik.values.primaryOrgId),
      });
    // associated orgs
    if (formik.values.participatingOrgs.length > 0) {
      summary.push({
        name: "Participating Orgs",
        value: formik.values.participatingOrgs
          .map((orgId) => getOrgNameById(orgId))
          .join(", "),
      });
    }

    // Add hit or molecule selection
    if (baseHitData) {
      summary.push({
        name: "Hit Collection",
        value: baseHitData.hitCollectionName || "N/A",
      });
    }

    if (selectedMolecule) {
      summary.push({
        name: "Molecule Name",
        value: selectedMolecule.name || "N/A",
      });
      summary.push({
        name: "Molecule SMILES",
        value: selectedMolecule.smilesCanonical || "N/A",
      });
    }

    // Add status
    summary.push({
      name: "Status",
      value: formik.values.status
        ? statusOptions.find((o) => o.value === formik.values.status)?.name
        : "Not Set",
    });

    return summary;
  };

  const summary = (
    <div className="flex flex-column w-full p-2 border-1 border-50 border-round-md gap-2">
      <div className="flex text-xl font-bold">
        Review the details of your project
      </div>
      <div className="flex">
        <Divider />
      </div>
      <div className="flex gap-2">
        {baseHitData?.compoundSMILES && (
          <div className="flex">
            <Panel
              header={baseHitData.primaryCompound?.name || "Primary Compound"}
            >
              <SmilesView smiles={baseHitData?.compoundSMILES} />
            </Panel>
          </div>
        )}
        <div className="flex flex-grow w-full border-1 border-50 border-round-md">
          <DataTable
            value={generateSummaryData()}
            className="flex flex-grow-1 w-full HideDataTableHeader"
          >
            <Column field="name"></Column>
            <Column field="value"></Column>
          </DataTable>
        </div>
      </div>
      {baseHitData?.associatedHits?.length > 0 && (
        <div className="flex">
          <Panel header={"Associated Compounds"}>
            <div className="flex gap-1">
              {baseHitData?.associatedHits?.map((hit) => (
                <div className="flex flex-column border-1 border-50 border-round-md">
                  <div className="flex p-2">
                    {hit.molecule?.name || "Unnamed Molecule"}
                  </div>
                  <div className="flex text-md">
                    <SmilesView smiles={hit.molecule?.smilesCanonical} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}
    </div>
  );

  const onSubmit = () => {
    let data = { ...formik.values };

    if (data.name.trim() === "") {
      toast.error("Name is required.");
      return; // Prevent further execution if the name is empty
    }
    if (data.primaryOrgId === "") {
      toast.error("Primary Organization is required.");
      return; // Prevent further execution if the primary org is empty
    }

    // Merge baseHitData only if it's present
    if (
      selectedAssocMethod === "screen" ||
      selectedAssocMethod === "compound"
    ) {
      data = { ...data, ...baseHitData };
    }

    console.log("FHANew -> data", data);
    addHa(data).then(() => {
      navigate("/wf/ha/dash/all-projects/");
    });
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

      <div className="flex w-full">
        <Stepper ref={stepperRef} className="w-full">
          <StepperPanel header="Nomenclature">
            <div className="flex flex-column w-full gap-2 ">
              <div className="flex w-full gap-2 justify-content-center border-0">
                {nomenclatureForm}
              </div>
            </div>
          </StepperPanel>
          <StepperPanel header="Compound">
            <div className="flex flex-column w-full gap-2">
              {associationPanel}
            </div>
          </StepperPanel>
          <StepperPanel header="Association">
            <div className="flex flex-column w-full gap-2">
              {selectedAssocMethod === "screen" && startWithScreenPanel}
              {selectedAssocMethod === "compound" && startWithCompoundPanel}
              {selectedAssocMethod === "startWithBlankTemplate" &&
                startWithBlankTemplate}
            </div>
          </StepperPanel>
          <StepperPanel header="Summary">
            <div className="flex flex-column w-full gap-2">
              {summary}
              <StepperNavButtons
                stepperRef={stepperRef}
                showNext={false}
                showSubmit={true}
                submitFunc={onSubmit}
                submitLabel="Create Hit Assessment"
                submitLoading={isAddingHa}
              />
            </div>
          </StepperPanel>
        </Stepper>
      </div>
    </div>
  );
};

export default observer(FHANew);
