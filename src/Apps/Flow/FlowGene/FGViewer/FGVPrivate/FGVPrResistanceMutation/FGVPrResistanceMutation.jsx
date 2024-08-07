import { observer } from "mobx-react-lite";
import { BlockUI } from "primereact/blockui";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Sidebar } from "primereact/sidebar";
import React, { useContext, useState } from "react";
import EmbeddedHelp from "../../../../../../Library/EmbeddedHelp/EmbeddedHelp";
import { RootStoreContext } from "../../../../../../RootStore";
import TableRowBodyDVar from "../../../../../../Shared/DVariable/TableRowBodyDVar";
import { TextAreaRowEditorDVar } from "../../../../../../Shared/TableRowEditorsDVar/TextAreaRowEditorDVar";
import FGVPrResistanceMutationAddForm from "./FGVPrResistanceMutationAddForm";

const FGVPrResistanceMutation = ({ selectedGene }) => {
  const [displayAddSideBar, setDisplayAddSideBar] = useState(false);
  const rootStore = useContext(RootStoreContext);
  const {
    isAddingResistanceMutation,
    addResistanceMutation,
    isUpdatingResistanceMutation,
    updateResistanceMutation,
    deleteResistanceMutation,
    isDeletingResistanceMutation,
  } = rootStore.geneResistanceMutationStore;

  const tableHeader = (
    <div className="table-header">
      <div className="flex justify-content-end">
        <div className="flex">
          <EmbeddedHelp>
            Resistance mutation is a genetic mutation that allows an organism,
            such as a bacterium or virus, to resist the effects of a particular
            drug or other environmental stressor. Resistance mutations work by
            altering the structure or function of a protein target, making it
            less susceptible to inhibition by the drug. Data: Mutation (For e.g
            : L273A) | Isolate (For e.g : Mutant3) | Parent Strain (For e.g
            Mc27000) | Compound (For e.g SAC-ID/Compound ID/Source ID) | Shift
            In Mic (For e.g 4X) | Organization (For e.g TAMU | Researcher name)
          </EmbeddedHelp>
        </div>
        <div className="flex flex-grow min-w-max">
          <Button
            type="button"
            icon="icon icon-common icon-plus-circle"
            label="Add"
            className="p-button-text p-button-sm"
            style={{ height: "30px", marginRight: "5px" }}
            onClick={() => setDisplayAddSideBar(true)}
          />
        </div>
      </div>
    </div>
  );

  const addSideBarHeader = (
    <div className="flex align-items-center gap-2">
      <i className="icon icon-common icon-plus-circle"></i>
      <span className="font-bold">Add Resistance Mutation</span>
    </div>
  );
  const deleteBodyTemplate = (rowData) => {
    const accept = () => {
      // Delete resistanceMutation
      deleteResistanceMutation(rowData.id);
    };
    const reject = () => {
      // Do nothing
    };

    return (
      <Button
        severity="danger"
        icon="ri-delete-bin-2-line"
        className="p-button-text"
        onClick={() => {
          confirmDialog({
            message: "Do you want to delete this record?",
            header: "Delete Confirmation",
            icon: "pi pi-info-circle",
            defaultFocus: "reject",
            acceptClassName: "p-button-danger",
            accept,
            reject,
          });
        }}
      />
    );
  };

  return (
    <>
      <BlockUI
        blocked={isUpdatingResistanceMutation || isDeletingResistanceMutation}
      >
        <DataTable
          value={selectedGene.resistanceMutations}
          editMode="row"
          dataKey="id"
          showGridlines
          removableSort
          header={tableHeader}
          onRowEditComplete={(e) => updateResistanceMutation(e.newData)}
        >
          <Column
            field="mutation"
            header="Mutation"
            body={(rowData) => <TableRowBodyDVar dVar={rowData?.mutation} />}
            editor={(options) => TextAreaRowEditorDVar(options)}
          />
          <Column
            field="isolate"
            header="Isolate"
            body={(rowData) => <TableRowBodyDVar dVar={rowData?.isolate} />}
            editor={(options) => TextAreaRowEditorDVar(options)}
          />
          <Column
            field="parentStrain"
            header="Parent Strain"
            body={(rowData) => (
              <TableRowBodyDVar dVar={rowData?.parentStrain} />
            )}
            editor={(options) => TextAreaRowEditorDVar(options)}
          />

          <Column
            field="researcher"
            header="Researcher"
            body={(rowData) => <TableRowBodyDVar dVar={rowData?.researcher} />}
            editor={(options) => TextAreaRowEditorDVar(options)}
          />

          <Column
            field="organization"
            header="Organization"
            sortable
            body={(rowData) => (
              <TableRowBodyDVar dVar={rowData?.organization} />
            )}
            editor={(options) => TextAreaRowEditorDVar(options)}
          />

          <Column
            field="compound"
            header="Compound"
            body={(rowData) => <TableRowBodyDVar dVar={rowData?.compound} />}
            editor={(options) => TextAreaRowEditorDVar(options)}
          />
          <Column
            field="shiftInMIC"
            header="Shift In MIC"
            body={(rowData) => <TableRowBodyDVar dVar={rowData?.shiftInMIC} />}
            editor={(options) => TextAreaRowEditorDVar(options)}
          />
          <Column
            field="notes"
            header="Notes"
            body={(rowData) => <TableRowBodyDVar dVar={rowData?.notes} />}
            editor={(options) => TextAreaRowEditorDVar(options)}
          />

          <Column
            field="reference"
            header="Reference"
            body={(rowData) => <TableRowBodyDVar dVar={rowData?.reference} />}
            editor={(options) => TextAreaRowEditorDVar(options)}
          />
          <Column
            rowEditor
            header="Edit"
            // headerStyle={{ width: "10%", minWidth: "8rem" }}
            bodyStyle={{ textAlign: "center" }}
          />
          <Column body={deleteBodyTemplate} header="Delete" />
        </DataTable>
      </BlockUI>
      <Sidebar
        visible={displayAddSideBar}
        position="right"
        onHide={() => setDisplayAddSideBar(false)}
        className="p-sidebar-sm"
        header={addSideBarHeader}
      >
        <FGVPrResistanceMutationAddForm
          selectedGene={selectedGene}
          isAddingResistanceMutation={isAddingResistanceMutation}
          addResistanceMutation={addResistanceMutation}
          closeSidebar={() => setDisplayAddSideBar(false)}
        />
      </Sidebar>
    </>
  );
};

export default observer(FGVPrResistanceMutation);
