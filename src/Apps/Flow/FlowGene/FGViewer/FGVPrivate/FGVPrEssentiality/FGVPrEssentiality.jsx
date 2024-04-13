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
import { TextAreaRowEditorDVar } from "../../../../../../Shared/TableRowEditorsDVar/TextAreaRowEditorDVar";
import FGVPrEssentialityAddForm from "./FGVPrEssentialityAddForm";
import * as Helper from "./FGVPrEssentialityHelper";

const FGVPrEssentiality = ({ selectedGene }) => {
  const [displayAddSideBar, setDisplayAddSideBar] = useState(false);

  const rootStore = useContext(RootStoreContext);
  const {
    isAddingEssentiality,
    addEssentiality,
    isUpdatingEssentiality,
    updateEssentiality,
    deleteEssentiality,
    isDeletingEssentiality,
  } = rootStore.geneEssentialityStore;

  const tableHeader = (
    <div className="table-header">
      <div className="flex justify-content-end">
        <div className="flex">
          <EmbeddedHelp>
            A gene is considered essential if it is required for the
            reproductive success of a cell or an organism. Gene essentiality is
            a core concept of genetics, with repercussions in evolutionary,
            systems and synthetic biology and with applications in drug
            development.
          </EmbeddedHelp>
        </div>
        <div className="flex flex-grow min-w-max">
          <Button
            type="button"
            icon="icon icon-common icon-plus-circle"
            label="Add Essentiality"
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
      <span className="font-bold">Add Essentiality</span>
    </div>
  );

  const deleteBodyTemplate = (rowData) => {
    const accept = () => {
      // Delete essentiality
      deleteEssentiality(rowData.id);
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
      <BlockUI blocked={isUpdatingEssentiality || isDeletingEssentiality}>
        <DataTable
          value={selectedGene.essentialities}
          editMode="row"
          dataKey="id"
          showGridlines
          removableSort
          size="small"
          header={tableHeader}
          onRowEditComplete={(e) => updateEssentiality(e.newData)}
        >
          <Column
            field="classification"
            header="Classification"
            body={(rowData) => rowData.classification.value}
            sortable
            sortField="classification.value"
            editor={(options) => Helper.classificationEditor(options)}
          />
          <Column
            field="condition"
            header="Condition"
            body={(rowData) => rowData.condition.value}
            editor={(options) => TextAreaRowEditorDVar(options)}
          />

          <Column
            field="method"
            header="Method"
            body={(rowData) => rowData.method.value}
            editor={(options) => TextAreaRowEditorDVar(options)}
          />
          <Column
            field="reference"
            header="Reference"
            body={(rowData) => rowData.reference.value}
            editor={(options) => TextAreaRowEditorDVar(options)}
          />
          <Column
            field="note"
            header="Notes"
            body={(rowData) => rowData.note.value}
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
        <FGVPrEssentialityAddForm
          selectedGene={selectedGene}
          isAddingEssentiality={isAddingEssentiality}
          addEssentiality={addEssentiality}
          closeSidebar={() => setDisplayAddSideBar(false)}
        />
      </Sidebar>
    </>
  );
};

export default observer(FGVPrEssentiality);
