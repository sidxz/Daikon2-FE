import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Fieldset } from "primereact/fieldset";
import React from "react";

const MLMViewGeneralInfo = ({ selectedMolecule }) => {
  let generalInfoData = [
    {
      name: "Molecule Name",
      value: selectedMolecule.name,
    },
    {
      name: "Molecule ID",
      value: selectedMolecule.id,
    },
    {
      name: "Molecule Weight",
      value: selectedMolecule.molecularWeight,
    },
    {
      name: "Total Polar Surface Area",
      value: selectedMolecule.tpsa,
    },
    {
      name: "SMILES",
      value: selectedMolecule.smiles,
    },
    {
      name: "SMILES Canonical",
      value: selectedMolecule.smilesCanonical,
    },
  ];

  return (
    <div className="flex pt-2">
      <Fieldset className="m-0 flex-grow-1" legend="General Information">
        <DataTable value={generalInfoData} className="HideDataTableHeader">
          <Column field="name"></Column>
          <Column field="value"></Column>
        </DataTable>
      </Fieldset>
    </div>
  );
};

export default MLMViewGeneralInfo;
