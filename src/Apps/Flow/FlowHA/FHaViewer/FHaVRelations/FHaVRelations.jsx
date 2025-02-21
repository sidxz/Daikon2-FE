import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { Fieldset } from "primereact/fieldset";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../../../../Library/Loading/Loading";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import SmilesView from "../../../../../Library/SmilesView/SmilesView";
import { RootStoreContext } from "../../../../../RootStore";
import { isValidGuid } from "../../../../../Shared/Validators/GUIDValidator";
import StepperNavButtons from "../../../../../UILib/StepperTools/NavButtons/StepperNavButtons";
import { appColors } from "../../../../../constants/colors";
import { HAIcon } from "../../../icons/HAIcon";
import FHaVAssociatedHits from "../FHaVInformation/components/FHaVAssociatedHits";
import * as Helper from "./FHaVRelationsHelper";
import FHaNewHitPicker from "../../FHaNew/components/FHaNewHitPicker/FHaNewHitPicker";
import FHaNewMoleculePicker from "../../FHaNew/components/FHaNewMoleculePicker/FHaNewMoleculePicker";
import { Divider } from "primereact/divider";
import { Panel } from "primereact/panel";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { se } from "../../../../../../node_modules/date-fns/locale/se";
import _ from "lodash";
const FHaVRelations = () => {
  const navigate = useNavigate();
  const rootStore = useContext(RootStoreContext);

  const stepperRef = useRef(null);

  const {
    fetchHa,
    selectedHa,
    isFetchingHa,
    isHaRegistryCacheValid,
    updateHa,
    isUpdatingHa,
  } = rootStore.haStore;
  const params = useParams();
  const {
    fetchMolecule,
    isFetchingMolecule,
    moleculeRegistry,
    selectedMolecule,
  } = rootStore.moleculeStore;

  const [screenSectionData, setScreenSectionData] = useState({
    selectedScreen: null,
    selectedHitCollection: null,
    selectedBaseHits: null,
    selectedPrimaryHit: null,
  });

  const [baseHitData, setBaseHitData] = useState(null);
  const [newSelectedMolecule, setNewSelectedMolecule] = useState(null);
  const [selectedAssocMethod, setSelectedAssocMethod] = useState(null);

  useEffect(() => {
    if (
      selectedHa === undefined ||
      selectedHa?.id !== params?.id ||
      !isHaRegistryCacheValid
    ) {
      //console.log("Fetching Ha");
      fetchHa(params.id);
    }
  }, [params.id, fetchHa, selectedHa, isHaRegistryCacheValid]);

  useEffect(() => {
    console.log("selectedHa?.compoundId", selectedHa?.compoundId);
    if (selectedHa?.compoundId && isValidGuid(selectedHa?.compoundId)) {
      fetchMolecule(selectedHa?.compoundId);
    }
  }, [selectedHa?.compoundId, fetchMolecule]);

  if (isFetchingHa || isFetchingMolecule) {
    return <Loading message={"Fetching Ha..."} />;
  }

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
        selectedMolecule={newSelectedMolecule}
        setSelectedMolecule={setNewSelectedMolecule}
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

    if (newSelectedMolecule) {
      summary.push({
        name: "Molecule Name",
        value: newSelectedMolecule.name || "N/A",
      });
      summary.push({
        name: "Molecule SMILES",
        value: newSelectedMolecule.smilesCanonical || "N/A",
      });
    }

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
      </div>
    </div>
  );

  const onSubmit = () => {
    console.log("Submitting...");

    let data = { ...selectedHa };
    // Merge baseHitData only if it's present
    if (
      selectedAssocMethod === "screen" ||
      selectedAssocMethod === "compound"
    ) {
      data = { ...data, ...baseHitData };
    }
    if (selectedAssocMethod === "startWithBlankTemplate") {
      data = _.omit(data, [
        "compoundId",
        "compoundSMILES",
        "associatedHits",
        "hitCollectionId",
        "hitId",
        "associatedHits",
        "associatedHitIds",
      ]);
    }

    console.log("FHANew -> data", data);
    updateHa(data);
  };

  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500">
      <div className="flex w-full">
        <BreadCrumb model={Helper.breadCrumbItems(selectedHa, navigate)} />
      </div>
      <div
        className="flex w-full"
        style={{
          filter: selectedHa?.isHaRemoved ? "grayscale(100%)" : "none",
        }}
      >
        <SecHeading
          svgIcon={<HAIcon size={"25em"} />}
          heading={"Ha - " + selectedHa.name}
          displayHorizon={true}
          color={appColors.sectionHeadingBg.ha}
          entryPoint={selectedHa?.id}
        />
      </div>
      <div className="flex flex-column w-full border-1 border-50 p-1 m-1 border-round-md gap-2">
        <div className="flex w-full text-xl p-2 bg-teal-100	">
          Current Association
        </div>
        <div className="flex w-full">
          <Fieldset className="m-0 flex-grow-1" legend="Primary Compound">
            <SmilesView smiles={selectedMolecule?.smilesCanonical} />
          </Fieldset>
        </div>

        <div className="flex w-full">
          <Fieldset className="m-0 flex-grow-1" legend="Associated Hits">
            <FHaVAssociatedHits />
          </Fieldset>
        </div>
      </div>
      <div className="flex flex-column w-full border-1 border-50 p-1 m-1 border-round-md gap-2">
        <div className="flex flex-column w-full p-2 bg-orange-100">
          <div className="flex w-full text-xl p-2 bg-orange-100">
            Update Association
          </div>
          <div className="flex w-full p-2 bg-orange-100">
            Caution: Updating the primary or associated molecule will modify the
            HA's connections to screens, hit lists, and compounds. Proceed
            carefully.
          </div>
        </div>
        <div className="flex w-full">
          <Stepper ref={stepperRef} className="w-full">
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
                  submitLabel="Update Hit Assessment"
                  submitLoading={isUpdatingHa}
                />
              </div>
            </StepperPanel>
          </Stepper>
        </div>
      </div>
    </div>
  );
};

export default observer(FHaVRelations);
