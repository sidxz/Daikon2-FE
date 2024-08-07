import { observer } from "mobx-react-lite";
import { BlockUI } from "primereact/blockui";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Sidebar } from "primereact/sidebar";
import React, { useContext, useState } from "react";
import EmbeddedHelp from "../../../../../../Library/EmbeddedHelp/EmbeddedHelp";
import FDate from "../../../../../../Library/FDate/FDate";
import { RootStoreContext } from "../../../../../../RootStore";
import TableRowBodyDVar from "../../../../../../Shared/DVariable/TableRowBodyDVar";
import { CalendarRowEditorDVar } from "../../../../../../Shared/TableRowEditorsDVar/CalendarRowEditorDVar";
import { TextAreaRowEditorDVar } from "../../../../../../Shared/TableRowEditorsDVar/TextAreaRowEditorDVar";
import FGVPrProteinProductionAddForm from "./FGVPrProteinProductionAddForm";

const FGVPrProteinProduction = ({ selectedGene }) => {
  const [displayAddSideBar, setDisplayAddSideBar] = useState(false);
  const rootStore = useContext(RootStoreContext);
  const {
    isAddingProteinProduction,
    addProteinProduction,
    isUpdatingProteinProduction,
    updateProteinProduction,
    deleteProteinProduction,
    isDeletingProteinProduction,
  } = rootStore.geneProteinProductionStore;

  const tableHeader = (
    <div className="table-header">
      <div className="flex justify-content-end">
        <div className="flex">
          <EmbeddedHelp>
            Protein production is the biotechnological process of generating a
            specific protein. It is typically achieved by the manipulation of
            gene expression in an organism such that it expresses large amounts
            of a recombinant gene. Data: A short summary describing the entire
            method. For e.g E-coli plasmid full length protein & associated
            scientist name Method (For e.g - HIS , Ecoli Rosetta, Plasmid) |
            Purity (Range or %age For e.g - 95% pure)
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
      <span className="font-bold">Add Protein Production</span>
    </div>
  );
  const deleteBodyTemplate = (rowData) => {
    const accept = () => {
      // Delete proteinProduction
      deleteProteinProduction(rowData.id);
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
        blocked={isUpdatingProteinProduction || isDeletingProteinProduction}
      >
        <DataTable
          value={selectedGene.proteinProductions}
          editMode="row"
          dataKey="id"
          showGridlines
          removableSort
          size="small"
          header={tableHeader}
          onRowEditComplete={(e) => updateProteinProduction(e.newData)}
        >
          <Column
            field="production"
            header="Production"
            body={(rowData) => <TableRowBodyDVar dVar={rowData?.production} />}
            editor={(options) => TextAreaRowEditorDVar(options)}
          />
          <Column
            field="method"
            header="Method"
            body={(rowData) => <TableRowBodyDVar dVar={rowData?.method} />}
            editor={(options) => TextAreaRowEditorDVar(options)}
          />
          <Column
            field="pmid"
            header="PMID"
            body={(rowData) => <TableRowBodyDVar dVar={rowData?.pmid} />}
            editor={(options) => TextAreaRowEditorDVar(options)}
          />
          <Column
            field="dateProduced"
            header="Date Produced"
            editor={(options) => CalendarRowEditorDVar(options)}
            body={(rowData) =>
              rowData?.dateProduced?.value && (
                <FDate timestamp={rowData.dateProduced.value} hideTime={true} />
              )
            }
          />
          <Column
            field="url"
            header="URL"
            body={(rowData) => <TableRowBodyDVar dVar={rowData?.url} />}
            editor={(options) => TextAreaRowEditorDVar(options)}
          />
          <Column
            field="purity"
            header="Purity"
            body={(rowData) => <TableRowBodyDVar dVar={rowData?.purity} />}
            editor={(options) => TextAreaRowEditorDVar(options)}
          />
          <Column
            field="notes"
            header="Notes"
            body={(rowData) => <TableRowBodyDVar dVar={rowData?.notes} />}
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
        <FGVPrProteinProductionAddForm
          selectedGene={selectedGene}
          isAddingProteinProduction={isAddingProteinProduction}
          addProteinProduction={addProteinProduction}
          closeSidebar={() => setDisplayAddSideBar(false)}
        />
      </Sidebar>
    </>
  );
};

export default observer(FGVPrProteinProduction);
