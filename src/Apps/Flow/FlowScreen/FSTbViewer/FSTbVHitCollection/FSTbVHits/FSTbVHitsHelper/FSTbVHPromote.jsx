import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SmilesView from "../../../../../../../Library/SmilesView/SmilesView";
const FSTbVHPromote = ({
  selectedHits,
  selectedScreen,
  selectedHitCollection,
  closeSideBar,
}) => {
  const navigate = useNavigate();
  const [ddSelectedPrimaryHit, setDdSelectedPrimaryHit] = useState(null);
  console.log("FSTbVHPromote -> selectedHits", selectedHits);

  let onButtonNextClick = () => {
    console.log("onButtonNextClick");
    if (!ddSelectedPrimaryHit) {
      console.log("Please select a primary molecule");
      toast.error("Please select a primary molecule");
      return;
    }

    let selectedAssociatedHits = {};
    selectedHits.forEach((hit) => {
      selectedAssociatedHits[hit.molecule.id] = hit.id;
    });

    let data = {
      hitId: ddSelectedPrimaryHit.id,
      compoundId: ddSelectedPrimaryHit.molecule.id,
      associatedHitIds: selectedAssociatedHits,
      hitCollectionId: selectedHitCollection.id,
      screenId: selectedScreen.id,
      compoundSMILES: ddSelectedPrimaryHit.molecule.smiles,
    };
    console.log(data);
    const jsonDataString = JSON.stringify(data);
    const encodedData = btoa(jsonDataString);

    console.log("encodedData", encodedData);

    navigate(`/wf/ha/new?data=${encodedData}`);
    closeSideBar();
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
  return (
    <div className="flex flex-column  gap-2 w-full">
      <div className="flex">
        <h4>Primary Molecule</h4>
      </div>
      <div className="flex">
        <Dropdown
          value={ddSelectedPrimaryHit}
          onChange={(e) => setDdSelectedPrimaryHit(e.value)}
          options={selectedHits}
          optionLabel={(hit) => hit?.molecule?.name}
          placeholder="Select Primary Molecule"
          className="w-full md:w-20rem"
          itemTemplate={ddPrimaryItemTemplate}
        />
      </div>
      <div className="flex">
        <h4>Associated Molecules</h4>
      </div>

      <div className="flex flex-column gap-2">
        {selectedHits.map((hit) => {
          return (
            <div className="flex flex-column border-1 border-50">
              <div className="flex  p-2">{hit?.molecule?.name}</div>
            </div>
          );
        })}
      </div>
      <Divider />
      <div className="flex w-full align-items-right justify-content-right">
        <Button
          icon="icon icon-common icon-database-submit"
          label="Next"
          className="w-full"
          onClick={onButtonNextClick}
        />
      </div>
    </div>
  );
};

export default observer(FSTbVHPromote);
