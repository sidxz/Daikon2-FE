import { observer } from "mobx-react-lite";
import { Divider } from "primereact/divider";
import React, { useContext, useEffect } from "react";
import SmilesView from "../../../../../../Library/SmilesView/SmilesView";
import { RootStoreContext } from "../../../../../../RootStore";

const FHaNewBaseHitData = ({ baseHitData }) => {
  const rootStore = useContext(RootStoreContext);
  const {
    fetchHitCollectionsOfScreen,
    isFetchingHitCollection,
    isHitCollectionRegistryCacheValid,
    hitCollectionOfScreen,
    getHitCollection,
  } = rootStore.hitCollectionStore;

  useEffect(() => {
    if (!isHitCollectionRegistryCacheValid) {
      fetchHitCollectionsOfScreen(baseHitData.screenId);
    }
  }, [
    isHitCollectionRegistryCacheValid,
    fetchHitCollectionsOfScreen,
    baseHitData.screenId,
  ]);

  let primarySMILES = getHitCollection(baseHitData.hitCollectionId)?.hits?.find(
    (hit) => hit.id === baseHitData.hitId
  )?.requestedSMILES;

  let associatedSMILES = [
    ...baseHitData.associatedHitIds.map((associatedHit) => {
      return getHitCollection(baseHitData.hitCollectionId)?.hits?.find(
        (hit) => hit.id === associatedHit.item1
      )?.requestedSMILES;
    }),
  ];

  return (
    <div className="flex flex w-full gap-4">
      <div className="flex flex-column w-1/2">
        <div className="flex">
          <Divider>Primary Molecule</Divider>{" "}
        </div>
        <div
          className="flex align-items-center justify-content-center"
          style={{ width: "200px", height: "200px" }}
        >
          <SmilesView smiles={primarySMILES} width={"200"} height={"200"} />
        </div>
      </div>
      <div className="flex flex-column w-1/2">
        <div className="flex">
          <Divider>Associated Molecules</Divider>
        </div>
        <div className="flex flex-row gap-2">
          {associatedSMILES.map((smiles, index) => (
            <div
              className="flex align-items-center justify-content-center"
              style={{ width: "200px", height: "200px" }}
            >
              {" "}
              <SmilesView
                key={index}
                smiles={smiles}
                width={"200"}
                height={"200"}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default observer(FHaNewBaseHitData);
