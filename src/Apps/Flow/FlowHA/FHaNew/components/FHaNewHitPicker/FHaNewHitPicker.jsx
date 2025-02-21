import { observer } from "mobx-react-lite";
import { Dropdown } from "primereact/dropdown";
import React, { useCallback, useContext, useEffect, useRef } from "react";
import SmilesView from "../../../../../../Library/SmilesView/SmilesView";
import { RootStoreContext } from "../../../../../../RootStore";

import { SelectButton } from "primereact/selectbutton";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import StepperNavButtons from "../../../../../../UILib/StepperTools/NavButtons/StepperNavButtons";
import { Tag } from "primereact/tag";

const FHaNewHitPicker = ({
  screenSectionData,
  setScreenSectionData,
  setBaseHitData,
  stepperRef,
}) => {
  const screenStepperRef = useRef(null);

  const rootStore = useContext(RootStoreContext);
  const {
    fetchScreens,
    isScreenListCacheValid,
    screenList,
    isFetchingScreens,
  } = rootStore.screenStore;

  const {
    fetchHitCollectionsOfScreen,
    isFetchingHitCollection,
    hitCollectionOfScreen,
  } = rootStore.hitCollectionStore;

  useEffect(() => {
    if (!isScreenListCacheValid) {
      fetchScreensSafe();
    }
  }, [isScreenListCacheValid]);

  const fetchScreensSafe = async () => {
    try {
      await fetchScreens();
    } catch (error) {
      console.error("Error fetching screens:", error);
    }
  };

  const handleScreenSelect = useCallback((screen) => {
    setScreenSectionData((prev) => ({
      ...prev,
      selectedScreen: screen,
      selectedHitCollection: null,
      selectedBaseHits: null,
      selectedPrimaryHit: null,
    }));
    fetchHitCollectionsSafe(screen.id);
  }, []);

  const fetchHitCollectionsSafe = async (screenId) => {
    try {
      await fetchHitCollectionsOfScreen(screenId);
    } catch (error) {
      console.error("Error fetching hit collections:", error);
    }
  };

  const handleHitCollectionSelect = (hitCollection) => {
    setScreenSectionData((prev) => ({
      ...prev,
      selectedHitCollection: hitCollection,
      selectedBaseHits: null,
      selectedPrimaryHit: null,
    }));
  };

  const handleBaseHitsSelect = (baseHits) => {
    setScreenSectionData((prev) => ({
      ...prev,
      selectedBaseHits: baseHits,
    }));
    console.log("Selected base hits:", baseHits);
  };

  const handlePrimaryHitSelect = (primaryHit) => {
    setScreenSectionData((prev) => ({
      ...prev,
      selectedPrimaryHit: primaryHit,
    }));
  };

  const RelationsBodyTemplate = (hit) => {
    // check if relations count is more than 0
    if (hit?.relations?.length > 1) {
      const hitAssessment = hit.relations.find(
        (relation) => relation.nodeType === "HitAssessment"
      );

      return (
        <div className="flex gap-1">
          <div className="flex">
            {hitAssessment && (
              <Tag value="HA" icon="pi pi-check" severity="success"></Tag>
            )}
          </div>
        </div>
      );
    } else {
      return <></>;
    }
  };

  const renderHitItemTemplate = (hit) => (
    <div className="flex flex-column bg-surface border-round p-2 border-0 w-full">
      <div className="flex border-0 border-50">
        <SmilesView smiles={hit?.requestedSMILES} width={200} height={200} />
      </div>
      <div className="flex flex-column gap-1 w-full border-0 align-items-center justify-content-center	align-content-center">
        <div className="flex align-items-center justify-content-center	align-content-center gap-2">
          <div className="flex">Name: {hit?.molecule?.name}</div>
          <div className="flex">{RelationsBodyTemplate(hit)} </div>
        </div>
        <div className="flex font-bold align-items-center justify-content-center	align-content-center">
          Cluster: {hit?.clusterGroup}
        </div>
        <div className="flex align-items-center justify-content-center	align-content-center">
          Library: {hit?.library}
        </div>
        <div className="flex align-items-center justify-content-center	align-content-center">
          MIC: {hit?.mic}
        </div>
        <div className="flex align-items-center justify-content-center	align-content-center">
          IC50: {hit?.iC50}
        </div>
      </div>
    </div>
  );

  const sortHits = (hits) => {
    return hits?.slice()?.sort((a, b) => {
      const clusterA = a.clusterGroup ?? Number.MAX_SAFE_INTEGER;
      const clusterB = b.clusterGroup ?? Number.MAX_SAFE_INTEGER;
      const clusterCompare = clusterA - clusterB;

      if (clusterCompare === 0) {
        const nameA = a.molecule?.name || "";
        const nameB = b.molecule?.name || "";
        return nameA.localeCompare(nameB);
      }

      return clusterCompare;
    });
  };

  const handleSubmit = () => {
    const {
      selectedPrimaryHit,
      selectedScreen,
      selectedHitCollection,
      selectedBaseHits,
    } = screenSectionData;

    if (!selectedPrimaryHit || !selectedScreen || !selectedHitCollection) {
      console.error("Submission failed: Missing required selections");
      return;
    }

    const associatedHits = selectedBaseHits.reduce((acc, hit) => {
      acc[hit.molecule.id] = hit.id;
      return acc;
    }, {});

    const submissionData = {
      hitId: selectedPrimaryHit.id,
      compoundId: selectedPrimaryHit.molecule.id,
      associatedHitIds: associatedHits,
      hitCollectionId: selectedHitCollection.id,
      screenId: selectedScreen.id,
      compoundSMILES: selectedPrimaryHit.molecule.smiles,
      hitCollectionName: selectedHitCollection.name,
      associatedHits: selectedBaseHits,
      primaryCompound: selectedPrimaryHit?.molecule,
    };

    try {
      setBaseHitData(submissionData);
      stepperRef.current.nextCallback();
      console.log("Base hit data set:", submissionData);
    } catch (error) {
      console.error("Error setting base hit data:", error);
    }
  };

  return (
    <div className="flex w-full">
      <div className="flex w-full gap-2 justify-content-center border-0">
        <div className="flex flex-column w-9 gap-2">
          <Stepper ref={screenStepperRef} className="w-full">
            <StepperPanel header="Screen">
              <div className="flex flex-column gap-2">
                <div className="flex text-lg">Let's start with a screen.</div>
                <Dropdown
                  value={screenSectionData.selectedScreen}
                  onChange={(e) => handleScreenSelect(e.value)}
                  options={screenList}
                  optionLabel="name"
                  placeholder="Step 1 | Select a Screen"
                  className="w-full"
                  filter
                  loading={isFetchingScreens}
                />
                <StepperNavButtons
                  stepperRef={screenStepperRef}
                  showBack={false}
                  nextDisabled={!screenSectionData.selectedScreen}
                />
              </div>
            </StepperPanel>
            <StepperPanel header="Hit Collection">
              <div className="flex flex-column gap-3">
                <div className="flex text-lg">
                  The available Hit Collections for the screen are listed below.
                </div>
                <div className="flex text-md">
                  After selecting a Hit Collection, you will be able to view its
                  compounds and choose them for Hit Assessment.
                </div>
                <Dropdown
                  value={screenSectionData.selectedHitCollection}
                  onChange={(e) => handleHitCollectionSelect(e.value)}
                  options={hitCollectionOfScreen(
                    screenSectionData.selectedScreen?.id
                  )}
                  optionLabel="name"
                  placeholder="Step 2 | Select Hit Collection"
                  className="w-full"
                  filter
                  loading={isFetchingHitCollection}
                />
                <StepperNavButtons
                  stepperRef={screenStepperRef}
                  nextDisabled={!screenSectionData.selectedHitCollection}
                />
              </div>
            </StepperPanel>
            <StepperPanel header="Hits">
              <div className="flex flex-column gap-3">
                <div className="flex text-lg">
                  Select all the hits (both primary and related) needed for the
                  Hit Assessment project.{" "}
                </div>
                <div className="flex text-md">
                  Keep in mind that this will create single HA project.
                </div>
                <SelectButton
                  multiple
                  value={screenSectionData.selectedBaseHits}
                  onChange={(e) => handleBaseHitsSelect(e.value)}
                  options={sortHits(
                    screenSectionData.selectedHitCollection?.hits
                  )}
                  optionLabel={(hit) =>
                    hit?.molecule?.name || "Unnamed Molecule"
                  }
                  className="w-full"
                  itemTemplate={renderHitItemTemplate}
                />
                <StepperNavButtons
                  stepperRef={screenStepperRef}
                  nextDisabled={!screenSectionData.selectedBaseHits}
                />
              </div>
            </StepperPanel>
            <StepperPanel header="Primary Hit">
              <div className="flex flex-column gap-3">
                <div className="flex text-lg">Select the primary hit. </div>
                <div className="flex text-md">
                  This hit will represent the group, while any additional
                  selected hits will appear as related hits in the Hit
                  Assessment Project.
                </div>
                <SelectButton
                  value={screenSectionData.selectedPrimaryHit}
                  onChange={(e) => handlePrimaryHitSelect(e.value)}
                  options={screenSectionData.selectedBaseHits}
                  optionLabel={(hit) => hit?.molecule?.name}
                  className="w-full"
                  itemTemplate={renderHitItemTemplate}
                />
                <StepperNavButtons
                  stepperRef={screenStepperRef}
                  nextDisabled={!screenSectionData.selectedPrimaryHit}
                  nextFunc={handleSubmit}
                />
              </div>
            </StepperPanel>
          </Stepper>
        </div>
      </div>
    </div>
  );
};

export default observer(FHaNewHitPicker);
