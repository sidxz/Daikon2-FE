import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Fieldset } from "primereact/fieldset";
import { FDateFormatted } from "../../../../Library/FDate/FDateFormatted";
import { AppOrgResolver } from "../../../../Shared/VariableResolvers/AppOrgResolver";
import { AppUserResolver } from "../../../../Shared/VariableResolvers/AppUserResolver";

const MLMViewDisclosureInformation = ({ selectedMolecule }) => {
  const { getIdFromUserFullName, getUserFullNameById } = AppUserResolver();
  const { getOrgAliasById } = AppOrgResolver();

  let generalInfoData = [
    {
      name: "Scientist",
      value: selectedMolecule.disclosureScientist,
    },
    {
      name: "Organization",
      value: getOrgAliasById(selectedMolecule?.disclosureOrgId),
    },
    {
      name: "Disclosed Date",
      value: FDateFormatted(selectedMolecule.structureDisclosedDate),
    },
    {
      name: "Stage",
      value: selectedMolecule.disclosureStage,
    },
    {
      name: "Reason",
      value: selectedMolecule.disclosureReason,
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
      name: "Type",
      value: selectedMolecule.disclosureType,
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
