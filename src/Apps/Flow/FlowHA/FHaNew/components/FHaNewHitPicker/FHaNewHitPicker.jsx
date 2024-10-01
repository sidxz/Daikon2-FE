import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import React, { useCallback, useContext, useEffect, useState } from "react";
import LoadingBlockUI from "../../../../../../Library/LoadingBlockUI/LoadingBlockUI";
import SmilesView from "../../../../../../Library/SmilesView/SmilesView";
import { RootStoreContext } from "../../../../../../RootStore";

const FHaNewHitPicker = ({ baseHitData, setBaseHitData }) => {
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [selectedHitCollection, setSelectedHitCollection] = useState(null);
  const [selectedBaseHits, setSelectedBaseHits] = useState(null);
  const [selectedPrimaryHit, setSelectedPrimaryHit] = useState(null);

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

  // Local function to safely fetch screens
  const fetchScreensSafe = async () => {
    try {
      await fetchScreens();
    } catch (error) {
      console.error("Error fetching screens:", error);
    }
  };

  // Event handler for selecting a screen
  const handleScreenSelect = useCallback((screen) => {
    setSelectedScreen(screen);
    fetchHitCollectionsSafe(screen.id);
  }, []);

  // Local function to safely fetch hit collections
  const fetchHitCollectionsSafe = async (screenId) => {
    try {
      await fetchHitCollectionsOfScreen(screenId);
    } catch (error) {
      console.error("Error fetching hit collections:", error);
    }
  };

  // Event handler for selecting a hit collection
  const handleHitCollectionSelect = (hitCollection) => {
    setSelectedHitCollection(hitCollection);
  };

  // Event handler for selecting base hits
  const handleBaseHitsSelect = (baseHits) => {
    setSelectedBaseHits(baseHits);
  };

  // Event handler for selecting the primary hit
  const handlePrimaryHitSelect = (primaryHit) => {
    setSelectedPrimaryHit(primaryHit);
  };

  // Helper function to generate hit item template
  const renderHitItemTemplate = (hit) => (
    <div className="flex flex gap-1 border-1 border-50">
      <div className="flex flex-column border-1 border-50 p-2">
        <div>Name: {hit?.molecule?.name}</div>
        <div>Cluster: {hit?.clusterGroup}</div>
        <div>Library: {hit?.library}</div>
        <div>MIC: {hit?.mic}</div>
        <div>IC50: {hit?.iC50}</div>
      </div>
      <div
        className="flex align-items-center justify-content-center"
        style={{ width: "200px", height: "200px" }}
      >
        <SmilesView smiles={hit?.requestedSMILES} width={200} height={200} />
      </div>
    </div>
  );

  // Helper function to sort hits by clusterGroup and molecule name
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

  // Submit handler to generate and set the base hit data
  const handleSubmit = () => {
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
    };

    try {
      setBaseHitData(submissionData);
    } catch (error) {
      console.error("Error setting base hit data:", error);
    }
  };

  return (
    <div className="flex flex-column w-full">
      <LoadingBlockUI blocked={isFetchingScreens || isFetchingHitCollection}>
        <div className="flex gap-2">
          {/* Screen Selection Dropdown */}
          <div className="flex w-full">
            <Dropdown
              value={selectedScreen}
              onChange={(e) => handleScreenSelect(e.value)}
              options={screenList}
              optionLabel="name"
              placeholder="Step 1 | Select a Screen"
              className="w-full"
              filter
            />
          </div>

          {/* Hit Collection Dropdown */}
          <div className="flex w-full">
            <Dropdown
              value={selectedHitCollection}
              onChange={(e) => handleHitCollectionSelect(e.value)}
              options={hitCollectionOfScreen(selectedScreen?.id)}
              optionLabel="name"
              placeholder="Step 2 | Select Hit Collection"
              className="w-full"
              filter
            />
          </div>

          {/* Base Hits MultiSelect */}
          <MultiSelect
            value={selectedBaseHits}
            onChange={(e) => handleBaseHitsSelect(e.value)}
            options={sortHits(selectedHitCollection?.hits)}
            optionLabel={(hit) => hit?.molecule?.name || "Unnamed Molecule"}
            placeholder="Step 3 | Select hits for assessment"
            className="w-full"
            itemTemplate={renderHitItemTemplate}
          />

          {/* Primary Hit Dropdown */}
          <div className="flex w-full">
            <Dropdown
              value={selectedPrimaryHit}
              onChange={(e) => handlePrimaryHitSelect(e.value)}
              options={selectedBaseHits}
              optionLabel={(hit) => hit?.molecule?.name}
              placeholder="Step 4 |Select Primary Molecule"
              className="w-full"
              itemTemplate={renderHitItemTemplate}
            />
          </div>

          {/* Submit Button */}
          <div className="flex w-full">
            <Button
              label="Select Molecules"
              icon="pi pi-check"
              className="p-button-secondary"
              onClick={handleSubmit}
            />
          </div>
        </div>
      </LoadingBlockUI>
    </div>
  );
};

export default observer(FHaNewHitPicker);
