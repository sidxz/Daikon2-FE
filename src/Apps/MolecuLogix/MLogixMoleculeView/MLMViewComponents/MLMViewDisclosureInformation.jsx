import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Fieldset } from "primereact/fieldset";
import { FDateFormatted } from "../../../../Library/FDate/FDateFormatted";
import { AppUserResolver } from "../../../../Shared/VariableResolvers/AppUserResolver";

const MLMViewDisclosureInformation = ({ selectedMolecule }) => {
  const { getIdFromUserFullName, getUserFullNameById } = AppUserResolver();

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
      value: FDateFormatted(selectedMolecule.structureDisclosedDate),
    },

    {
      name: "Registered By",
      value: getUserFullNameById(selectedMolecule?.structureDisclosedByUserId),
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
