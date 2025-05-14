import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Fieldset } from "primereact/fieldset";
import React from "react";

const MLMViewDisclosureInformation = ({ selectedMolecule }) => {
  let generalInfoData = [
    {
      name: "Disclosure Scientist",
      value: selectedMolecule.disclosureScientist,
    },
    {
      name: "Notes",
      value: selectedMolecule.disclosureNotes,
    },
    {
      name: "Literature References",
      value: selectedMolecule.literatureReferences,
    },

    {
      name: "Reason",
      value: selectedMolecule.disclosureReason,
    },

    {
      name: "Stage",
      value: selectedMolecule.disclosureStage,
    },
    {
      name: "Type",
      value: selectedMolecule.disclosureType,
    },
    {
      name: "Disclosed Date",
      value: selectedMolecule.structureDisclosedDate,
    },
    {
      name: "DisclosedByUserId",
      value: selectedMolecule.structureDisclosedByUserId,
    },
  ];

  return (
    <div className="flex pt-2 w-full">
      <Fieldset
        className="m-0 flex-grow-1 w-full"
        legend="Disclosure Information"
      >
        <DataTable value={generalInfoData} className="HideDataTableHeader">
          <Column className="font-bold" field="name"></Column>
          <Column field="value"></Column>
        </DataTable>
      </Fieldset>
    </div>
  );
};

export default MLMViewDisclosureInformation;
