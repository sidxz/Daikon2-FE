import { Fieldset } from "primereact/fieldset";
import React from "react";
import SmilesView from "../../../../Library/SmilesView/SmilesView";

const MLMViewStructureCanonical = ({ selectedMolecule }) => {
  return (
    <div className="flex pt-2">
      <Fieldset className="m-0 flex-grow-1" legend="Structure SMILES Canonical">
        <SmilesView
          smiles={selectedMolecule?.smilesCanonical}
          width={400}
          height={400}
        />
      </Fieldset>
    </div>
  );
};

export default MLMViewStructureCanonical;
