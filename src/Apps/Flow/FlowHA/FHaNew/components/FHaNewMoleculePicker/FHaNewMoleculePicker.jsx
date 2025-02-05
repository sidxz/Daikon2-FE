import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useRef, useState } from "react";
import { RootStoreContext } from "../../../../../../RootStore";

import { SelectButton } from "primereact/selectbutton";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { NavLink } from "react-router-dom";
import { appColors } from "../../../../../../constants/colors";
import SmilesView from "../../../../../../Library/SmilesView/SmilesView";
import StepperNavButtons from "../../../../../../UILib/StepperTools/NavButtons/StepperNavButtons";
import MCompoundSelector from "../../../../../MolecuLogix/MCompoundSelector/MCompoundSelector";
import { HitCollectionIcon } from "../../../../icons/HitCollectionIcon";

const FHaNewMoleculePicker = ({ setBaseHitData, stepperRef }) => {
  const rootStore = useContext(RootStoreContext);
  const {
    fetchAssociationsForMolecule,
    associations,
    isFetching,
    getFilteredAssociations,
  } = rootStore.moleculeAssociationStore;

  const {
    fetchHitCollectionsOfScreen,
    isFetchingHitCollection,
    hitCollectionOfScreen,
    getHitCollection,
  } = rootStore.hitCollectionStore;

  const compoundStepperRef = useRef(null);
  const [selectedMolecule, setSelectedMolecule] = useState(null);
  const [relationsAvailable, setRelationsAvailable] = useState(false);
  const [filteredAssociations, setFilteredAssociations] = useState([]);
  const [selectedHitCollection, setSelectedHitCollection] = useState(null);
  const [selectedRelation, setSelectedRelation] = useState(null);
  const [selectedBaseHits, setSelectedBaseHits] = useState([]);
  const [primaryHit, setPrimaryHit] = useState(null);

  useEffect(() => {
    if (selectedMolecule) {
      // Fetch associations when a molecule is selected
      fetchAssociationsForMolecule(selectedMolecule.id)
        .then(() => {
          const filtered = getFilteredAssociations("HitCollection");
          setFilteredAssociations(filtered);

          // Set relationsAvailable based on filtered associations
          setRelationsAvailable(filtered.length > 0);
        })
        .catch((error) => {
          console.error("Error fetching molecule associations:", error);
          setRelationsAvailable(false);
        });

      // Fetch hit id
    }
  }, [selectedMolecule, fetchAssociationsForMolecule, getFilteredAssociations]);

  useEffect(() => {
    if (selectedRelation) {
      // Fetch the selected hit collection
      console.log("Selected Relation:", selectedRelation);
      console.log(
        "Fetching hit collections for screen ID:",
        selectedRelation.nodeProperties.screenId
      );

      fetchHitCollectionsOfScreen(
        selectedRelation.nodeProperties.screenId
      ).then(() => {
        console.log("Fetching hit collection:", selectedRelation.id);
        setSelectedHitCollection(getHitCollection(selectedRelation.id));
      });
    }
  }, [selectedRelation, fetchHitCollectionsOfScreen]);

  if (selectedHitCollection) {
    console.log("Selected Hit Collection:", selectedHitCollection);

    const pHit = selectedHitCollection.hits.find(
      (hit) => hit.moleculeId === selectedMolecule.id
    );
    if (primaryHit === null || primaryHit.id !== pHit.id) {
      console.log("Setting primary hit", pHit);
      setPrimaryHit(pHit);
    }
    compoundStepperRef.current.nextCallback?.();
  }

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
    const associatedHits = selectedBaseHits.reduce((acc, hit) => {
      acc[hit.molecule.id] = hit.id;
      return acc;
    }, {});

    const submissionData = {
      hitId: primaryHit?.id,
      compoundId: selectedMolecule.id,
      associatedHitIds: associatedHits,
      hitCollectionId: selectedHitCollection?.id,
      hitCollectionName: selectedHitCollection.name,
      compoundSMILES: selectedMolecule.smiles,
      associatedHits: selectedBaseHits,
      primaryCompound: primaryHit?.molecule,
    };

    try {
      console.log(submissionData);
      setBaseHitData(submissionData);
      stepperRef.current.nextCallback();
      console.log("Base hit data set:", submissionData);
    } catch (error) {
      console.error("Error setting base hit data:", error);
    }
  };

  const renderHitItemTemplate = (hit) => (
    <div className="flex flex-column bg-surface border-round p-2 border-0 w-full">
      <div className="flex border-0 border-50">
        <SmilesView smiles={hit?.requestedSMILES} width={200} height={200} />
      </div>
      <div className="flex flex-column gap-1 w-full border-0 align-items-center justify-content-center	align-content-center">
        <div className="flex align-items-center justify-content-center	align-content-center">
          Name: {hit?.molecule?.name}
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

  // console.log("Selected Molecule:", selectedMolecule);
  // console.log("Filtered Associations:", filteredAssociations);
  // console.log("Relations Available:", relationsAvailable);
  //console.log("Selected Relation:", selectedRelation);

  return (
    <div className="flex w-full">
      <div className="flex w-full gap-2 justify-content-center border-0">
        <div className="flex flex-column w-9 gap-2">
          <Stepper ref={compoundStepperRef} className="w-full">
            {/* Step 1: Search / Register Compound */}
            <StepperPanel header="Search / Register Compound">
              <div className="flex flex-column gap-2">
                <div className="flex text-2xl">
                  Let's start by searching for the compound in the MLogix
                  database.
                </div>
                <div className="flex text-xl">
                  If the compound is not yet registered, please{" "}
                  <NavLink className="pl-1 pr-1" to="/moleculogix/search/">
                    register
                  </NavLink>{" "}
                  it first.
                </div>
                <div className="flex w-full border-0">
                  <MCompoundSelector
                    onCompoundSelect={(m) => {
                      setRelationsAvailable(false);
                      setSelectedBaseHits([]);
                      setFilteredAssociations(false);
                      setSelectedHitCollection(false);
                      setSelectedRelation(null);
                      setSelectedMolecule(m);

                      compoundStepperRef.current.nextCallback?.();
                    }}
                  />
                </div>
              </div>
            </StepperPanel>

            {/* Step 2: Screen and Hit Collection */}
            <StepperPanel header="Screen and Hit Collection">
              <div className="flex flex-column gap-2">
                {isFetching ? (
                  <div>Loading associations...</div> // Show loading state
                ) : relationsAvailable ? (
                  <div>
                    <div className="flex text-lg">
                      The compound was found in the following Hit Collections.
                      Please select the appropriate one to link the Hit
                      Assessment to the corresponding screen's Hit Collection.
                    </div>
                    <div className="flex flex-column p-2 gap-2">
                      {filteredAssociations.map((relation, index) => (
                        <div
                          className="flex w-full m-2 p-2 border-1 border-50  border-round-md cursor-pointer"
                          style={{
                            borderColor: appColors.sectionHeadingBg.screen,
                          }}
                          onClick={() => setSelectedRelation(relation)}
                        >
                          <HitCollectionIcon size={"25em"} />
                          <div
                            className="w-full p-2 m-2 text-lg	font-semibold"
                            key={index}
                          >
                            {relation.nodeName}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-column gap-3">
                    <div className="flex text-lg">
                      We could not find any relations available for this
                      molecule. As a result, this Hit Assessment will not be
                      traced back to a screen.
                    </div>
                    <StepperNavButtons stepperRef={compoundStepperRef} />
                  </div>
                )}
              </div>
            </StepperPanel>

            {/* Step 3: Hits */}
            <StepperPanel header="Additional Hits">
              <div className="flex flex-column gap-3">
                <div className="flex text-lg">
                  Select all related hits for the Hit Assessment project. The
                  compound you started with will serve as the primary hit
                  representing the group, while these additional selected hits
                  will appear as related hits in the Hit Assessment Project. If
                  there are no additional hits, you can skip this step.
                </div>
                <SelectButton
                  multiple
                  value={selectedBaseHits}
                  onChange={(e) => setSelectedBaseHits(e.value)}
                  options={sortHits(selectedHitCollection?.hits)}
                  optionLabel={(hit) =>
                    hit?.molecule?.name || "Unnamed Molecule"
                  }
                  className="flex flex-wrap w-full p-0 border-1 border-50 align-content-center	"
                  itemTemplate={renderHitItemTemplate}
                />
              </div>
              <StepperNavButtons
                stepperRef={stepperRef}
                nextFunc={handleSubmit}
              />
            </StepperPanel>
          </Stepper>
        </div>
      </div>
    </div>
  );
};

export default observer(FHaNewMoleculePicker);
