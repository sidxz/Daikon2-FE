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
import { CalendarRowEditor } from "../../../../../../Shared/TableRowEditors/CalendarRowEditor";
import { TextAreaRowEditor } from "../../../../../../Shared/TableRowEditors/TextAreaRowEditor";
import FGVPrHypomorphAddForm from "./FGVPrHypomorphAddForm";

const FGVPrHypomorph = ({ selectedGene }) => {
  const [displayAddSideBar, setDisplayAddSideBar] = useState(false);
  const rootStore = useContext(RootStoreContext);
  const {
    isAddingHypomorph,
    addHypomorph,
    isUpdatingHypomorph,
    updateHypomorph,
    deleteHypomorph,
    isDeletingHypomorph,
  } = rootStore.geneHypomorphStore;

  const tableHeader = (
    <div className="table-header">
      <div className="flex justify-content-end">
        <div className="flex">
          <EmbeddedHelp>
            In drug discovery, a hypomorph refers to a genetic mutation that
            results in reduced, but not completely absent, expression or
            activity of a protein target. Hypomorphs can provide important
            insights into the function of a protein target and can be used to
            develop drugs that modulate its activity.
          </EmbeddedHelp>
        </div>
        <div className="flex flex-grow min-w-max">
          <Button
            type="button"
            icon="icon icon-common icon-plus-circle"
            label="Add Hypomorph"
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
      <span className="font-bold">Add Hypomorph</span>
    </div>
  );
  const deleteBodyTemplate = (rowData) => {
    const accept = () => {
      // Delete hypomorph
      console.log("Delete hypomorph:", rowData);
      deleteHypomorph(rowData.hypomorphId);
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
      <BlockUI blocked={isUpdatingHypomorph || isDeletingHypomorph}>
        <DataTable
          value={selectedGene.hypomorphs}
          editMode="row"
          dataKey="hypomorphId"
          showGridlines
          removableSort
          header={tableHeader}
          onRowEditComplete={(e) => updateHypomorph(e.newData)}
        >
          <Column
            field="knockdownStrain"
            header="Knockdown Strain"
            editor={(options) => TextAreaRowEditor(options)}
          />
          <Column
            field="method"
            header="Method"
            editor={(options) => TextAreaRowEditor(options)}
          />
          <Column
            field="pmid"
            header="PMID"
            editor={(options) => TextAreaRowEditor(options)}
          />
          <Column
            field="dateProduced"
            header="Date Produced"
            editor={(options) => CalendarRowEditor(options)}
            body={(rowData) =>
              rowData.dateProduced && (
                <FDate timestamp={rowData.dateProduced} hideTime={true} />
              )
            }
          />
          <Column
            field="url"
            header="URL"
            editor={(options) => TextAreaRowEditor(options)}
          />
          <Column
            field="purity"
            header="Purity"
            editor={(options) => TextAreaRowEditor(options)}
          />
          <Column
            field="notes"
            header="Notes"
            editor={(options) => TextAreaRowEditor(options)}
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
        <FGVPrHypomorphAddForm
          selectedGene={selectedGene}
          isAddingHypomorph={isAddingHypomorph}
          addHypomorph={addHypomorph}
          closeSidebar={() => setDisplayAddSideBar(false)}
        />
      </Sidebar>
    </>
  );
};

export default observer(FGVPrHypomorph);
