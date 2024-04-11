import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import React, { useContext, useEffect, useState } from "react";
import LoadingBlockUI from "../../../../../../Library/LoadingBlockUI/LoadingBlockUI";
import SmilesView from "../../../../../../Library/SmilesView/SmilesView";
import { RootStoreContext } from "../../../../../../RootStore";

const FHaNewHitPicker = ({ baseHitData, setBaseHitData }) => {
  const [ddSelectedScreen, setDdSelectedScreen] = useState(null);
  const [ddSelectedHitCollection, setDdSelectedHitCollection] = useState(null);
  const [ddSelectedBaseHits, setDdSelectedBaseHits] = useState(null);
  const [ddSelectedPrimaryHit, setDdSelectedPrimaryHit] = useState(null);

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
    isHitCollectionRegistryCacheValid,
    hitCollectionOfScreen,
    getHitCollection,
  } = rootStore.hitCollectionStore;

  useEffect(() => {
    if (!isScreenListCacheValid) {
      fetchScreens();
    }
  }, [isScreenListCacheValid, fetchScreens]);

  let btn = (
    <div className="w-full text-center p-2 m-2">
      <Button
        icon="pi pi-plus"
        className="p-button-rounded p-button-secondary"
      />
    </div>
  );

  let onScreenSelect = (screen) => {
    setDdSelectedScreen(screen);
    fetchHitCollectionsOfScreen(screen.id);
  };

  let onHitCollectionSelect = (hitCollection) => {
    setDdSelectedHitCollection(hitCollection);
  };

  let onBaseHitsSelect = (baseHits) => {
    setDdSelectedBaseHits(baseHits);
  };

  let ddPrimaryItemTemplate = (hit) => {
    return (
      <div className="flex flex gap-1 border-1 border-50">
        <div className="flex flex-column border-1 border-50">
          <div className="flex  p-2">Name: {hit?.molecule?.name}</div>
          <div className="flex  p-2">Cluster: {hit?.clusterGroup}</div>
          <div className="flex  p-2">Library: {hit?.library}</div>
          <div className="flex p-2">MIC: {hit?.mic}</div>
          <div className="flex  p-2">IC50: {hit?.iC50}</div>
        </div>
        <div
          className="flex align-items-center justify-content-center"
          style={{ width: "200px", height: "200px" }}
        >
          <SmilesView
            smiles={hit?.requestedSMILES}
            width={"200"}
            height={"200"}
          />
        </div>
      </div>
    );
  };

  let onSubmitClicked = () => {
    let selectedAssociatedHits = {};
    ddSelectedBaseHits.forEach((hit) => {
      selectedAssociatedHits[hit.molecule.id] = hit.id;
    });
    let data = {
      hitId: ddSelectedPrimaryHit.id,
      compoundId: ddSelectedPrimaryHit.molecule.id,
      associatedHitIds: selectedAssociatedHits,
      hitCollectionId: ddSelectedHitCollection.id,
      screenId: ddSelectedScreen.id,
      compoundSMILES: ddSelectedPrimaryHit.molecule.smiles,
    };
    setBaseHitData(data);
    console.log(data);
  };

  return (
    <div className="flex flex-column w-full">
      <LoadingBlockUI blocked={isFetchingScreens || isFetchingHitCollection}>
        <div className="flex gap-2">
          <div className="flex w-full">
            <Dropdown
              value={ddSelectedScreen}
              onChange={(e) => onScreenSelect(e.value)}
              options={screenList}
              optionLabel="name"
              placeholder="Select a Screen"
              className="w-full "
              filter
            />
          </div>
          <div className="flex w-full">
            <Dropdown
              value={ddSelectedHitCollection}
              onChange={(e) => onHitCollectionSelect(e.value)}
              options={hitCollectionOfScreen(ddSelectedScreen?.id)}
              optionLabel="name"
              placeholder="Select Hit Collection"
              className="w-full "
              filter
            />
          </div>
          <div className="flex w-full">
            <MultiSelect
              value={ddSelectedBaseHits}
              onChange={(e) => onBaseHitsSelect(e.value)}
              options={ddSelectedHitCollection?.hits}
              optionLabel={(hit) => hit?.molecule?.name}
              placeholder="Pick Hits"
              className="w-full "
              itemTemplate={ddPrimaryItemTemplate}
            />
          </div>

          <div className="flex w-full">
            <Dropdown
              value={ddSelectedPrimaryHit}
              onChange={(e) => setDdSelectedPrimaryHit(e.value)}
              options={ddSelectedBaseHits}
              optionLabel={(hit) => hit?.molecule?.name}
              placeholder="Select Primary Molecule"
              className="w-full "
              itemTemplate={ddPrimaryItemTemplate}
            />
          </div>
          <div className="flex w-full">
            <Button
              label="Select Molecules"
              icon="pi pi-check"
              className="p-button-secondary"
              onClick={onSubmitClicked}
            />
          </div>
        </div>
      </LoadingBlockUI>
    </div>
  );
};

export default observer(FHaNewHitPicker);
