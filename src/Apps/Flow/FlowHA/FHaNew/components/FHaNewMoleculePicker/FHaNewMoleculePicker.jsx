import { observer } from "mobx-react-lite";
import { Dropdown } from "primereact/dropdown";
import React, { useContext, useEffect } from "react";
import SmilesView from "../../../../../../Library/SmilesView/SmilesView";
import { RootStoreContext } from "../../../../../../RootStore";

const FHaNewMoleculePicker = ({ selectedMolecule, setSelectedMolecule }) => {
  const rootStore = useContext(RootStoreContext);
  const {
    moleculeList,
    fetchMolecules,
    isFetchingMolecules,
    isMoleculeRegistryCacheValid,
  } = rootStore.moleculeStore;

  useEffect(() => {
    if (!isMoleculeRegistryCacheValid) {
      fetchMolecules();
    }
  }, [isMoleculeRegistryCacheValid, fetchMolecules]);

  let moleculeTemplate = (molecule) => {
    return (
      <div className="flex flex gap-1 border-1 border-50">
        <div className="flex flex-column border-1 border-50">
          <div className="flex  p-2">Name: {molecule?.name}</div>
        </div>
        <div
          className="flex align-items-center justify-content-center"
          style={{ width: "200px", height: "200px" }}
        >
          <SmilesView
            smiles={molecule?.smilesCanonical}
            width={"200"}
            height={"200"}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-column w-full">
      <div className="flex w-full">
        <Dropdown
          value={selectedMolecule}
          onChange={(e) => setSelectedMolecule(e.value)}
          options={moleculeList}
          optionLabel="name"
          placeholder="Select a Molecule"
          className="w-full"
          //itemTemplate={moleculeTemplate}
          filter
          showClear
        />
      </div>
    </div>
  );
};

export default observer(FHaNewMoleculePicker);
