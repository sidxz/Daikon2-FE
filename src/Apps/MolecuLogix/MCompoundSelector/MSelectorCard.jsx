import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import React from "react";
import SmilesView from "../../../Library/SmilesView/SmilesView";

const MSelectorCard = ({
  molecule,
  searchType,
  searchValue,
  onCompoundSelect,
}) => {
  return (
    <Button
      className="flex flex-column w-4 bg-surface border-round p-2 border-1 border-50 p-button-outlined"
      severity="secondary"
      id={molecule.id}
      key={molecule.id}
      onClick={() => {
        onCompoundSelect(molecule);
      }}
    >
      <div className="flex border-0 border-50">
        <SmilesView
          smiles={molecule.smilesCanonical}
          subStructure={searchType === "substructure" ? searchValue : null}
          width={150}
          height={150}
        />
      </div>
      <div className="flex flex-column gap-1">
        <div className="flex">
          <p className="text-2xl m-0">{molecule.name}</p>
        </div>
        {searchType === "similarity" && (
          <div className="flex">
            <p className="text-xl m-0">
              Similarity : {(molecule.similarity * 100).toFixed(0)} %
            </p>
          </div>
        )}
        {searchType === "name" && (
          <div className="flex">
            <p className="text-sm m-0">Synonyms : {molecule.synonyms}</p>
          </div>
        )}

        <div className="flex">
          <p className="text-lg m-0 text-color-secondary">
            Mol Weight : {molecule.molecularWeight.toFixed(2)}
          </p>
        </div>
        <div className="flex">
          <p className="text-lg m-0 text-color-secondary">
            TPSA : {molecule.tpsa.toFixed(2)}
          </p>
        </div>
      </div>
    </Button>
  );
};

export default observer(MSelectorCard);
