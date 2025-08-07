import { observer } from "mobx-react-lite";

import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import FDate from "../../../../Library/FDate/FDate";
import { DVariableResolver } from "../../../../Shared/DVariable/DVariableResolver";
import { AppOrgResolver } from "../../../../Shared/VariableResolvers/AppOrgResolver";
import { AppUserResolver } from "../../../../Shared/VariableResolvers/AppUserResolver";
import { templates } from "./templates";

const MDRTable = ({ data, isFetchingRecentDisclosures }) => {
  const { getIdFromUserFullName, getUserFullNameById } = AppUserResolver();
  const { getOrgAliasById } = AppOrgResolver();

  //console.log("MDRTable data: ", data);
  return (
    <DataTable
      className="min-w-full"
      value={data}
      loading={isFetchingRecentDisclosures}
    >
      <Column
        field="structure"
        header="Structure"
        body={templates.structureTemplate}
      ></Column>
      <Column
        field="name"
        header="Name"
        sortable
        body={(rowData) => {
          return <p>{DVariableResolver(rowData?.name)}</p>;
        }}
      ></Column>
      <Column
        field="disclosureOrgId"
        header="Organization"
        body={(rowData) => getOrgAliasById(rowData?.disclosureOrgId)}
      ></Column>
      <Column field="disclosureScientist" header="Scientist Name"></Column>

      <Column
        field="structureDisclosedDate"
        header="Disclosed Date"
        sortable
        body={(rowData) => (
          <FDate timestamp={rowData?.structureDisclosedDate} hideTime={true} />
        )}
      ></Column>
      <Column field="stage" header="Stage"></Column>
      <Column field="disclosureReason" header="Disclosure Reason"></Column>
      <Column
        field="horizonRelations"
        header="Relations"
        body={templates.relationshipsTemplate}
      ></Column>
      <Column
        field="bioActivity"
        header="Bioactivity"
        body={templates.bioActivityTemplate}
      ></Column>
      <Column field="disclosureNotes" header="Disclosure Notes"></Column>

      <Column
        field="literatureReferences"
        header="Literature References"
      ></Column>
    </DataTable>
  );
};

export default observer(MDRTable);
