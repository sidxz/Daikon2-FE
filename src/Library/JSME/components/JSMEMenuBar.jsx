import { Button } from "primereact/button";
import React from "react";
import { MolecuLogixIcon } from "../../../Apps/MolecuLogix/Icons/MolecuLogixIcon";

const JSMEMenuBar = ({ smiles, onSave }) => {
  return (
    <div className="table-header flex flex-row w-full shadow-1 fadein">
      <div className="flex justify-content-start gap-1 text-xl text-primary align-items-center pl-2">
        <div className="flex flex-grow min-w-max">
          <MolecuLogixIcon />
        </div>
        <div className="flex flex-grow min-w-max">MolecuLogix</div>
      </div>
      <div className="flex justify-content-end w-full">
        <div className="flex flex-grow min-w-max">
          <Button
            type="button"
            icon="pi pi-plus"
            label="Save & Close Editor"
            className="p-button-text p-button-md"
            onClick={() => onSave(smiles)}
          />
        </div>
      </div>
    </div>
  );
};

export default JSMEMenuBar;
