import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Fieldset } from "primereact/fieldset";
import React from "react";

const MLMViewGeneralInfo = ({ selectedMolecule }) => {
  let generalInfoData = [
    {
      name: "Name",
      value: selectedMolecule.name,
    },
    {
      name: "Synonyms",
      value: selectedMolecule.synonyms,
    },

    {
      name: "Molecule Mass (g/mol)",
      value: selectedMolecule.molecularWeight,
    },
    {
      name: "cLog P",
      value: selectedMolecule.cLogP,
    },
    {
      name: "H-bond donors",
      value: selectedMolecule.lipinskiHBD,
    },
    {
      name: "H-bond acceptors",
      value: selectedMolecule.lipinskiHBA,
    },
    {
      name: "Lipinski Rule of 5",
      value: selectedMolecule.rO5Compliant ? "Complaint" : "Not Complaint",
    },
    {
      name: "TPSA (Å²)",
      value: selectedMolecule.tpsa,
    },
  ];

  return (
    <div className="flex pt-2 w-full">
      <Fieldset className="m-0 flex-grow-1 w-full" legend="General Information">
        <DataTable value={generalInfoData} className="HideDataTableHeader">
          <Column className="font-bold" field="name"></Column>
          <Column field="value"></Column>
        </DataTable>
      </Fieldset>
    </div>
  );
};

export default MLMViewGeneralInfo;
