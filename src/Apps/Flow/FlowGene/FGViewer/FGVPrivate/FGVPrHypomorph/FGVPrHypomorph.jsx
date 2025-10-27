import { observer } from "mobx-react-lite";
import { BlockUI } from "primereact/blockui";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Sidebar } from "primereact/sidebar";
import { useContext, useState } from "react";
import EmbeddedHelp from "../../../../../../Library/EmbeddedHelp/EmbeddedHelp";
import { RootStoreContext } from "../../../../../../RootStore";
import TableRowBodyDVar from "../../../../../../Shared/DVariable/TableRowBodyDVar";
import { TextAreaRowEditorDVar } from "../../../../../../Shared/TableRowEditorsDVar/TextAreaRowEditorDVar";
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
      <span className="font-bold">Add Hypomorph</span>
    </div>
  );
  const deleteBodyTemplate = (rowData) => {
    const accept = () => {
      // Delete hypomorph
      deleteHypomorph(rowData.id);
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
          dataKey="id"
          showGridlines
          removableSort
          size="small"
          header={tableHeader}
          onRowEditComplete={(e) => updateHypomorph(e.newData)}
        >
          <Column
            header="#"
            body={(data, options) => options.rowIndex + 1}
          ></Column>
          <Column
            field="knockdownStrain"
            header="Knockdown strain"
            body={(rowData) => (
              <TableRowBodyDVar dVar={rowData?.knockdownStrain} />
            )}
            editor={(options) => TextAreaRowEditorDVar(options)}
          />
          <Column
            field="phenotype"
            header="Phenotype"
            body={(rowData) => <TableRowBodyDVar dVar={rowData?.phenotype} />}
            editor={(options) => TextAreaRowEditorDVar(options)}
          />
          <Column
            field="growthDefect"
            header="Growth defect"
            body={(rowData) => (
              <TableRowBodyDVar dVar={rowData?.growthDefect} />
            )}
            editor={(options) => TextAreaRowEditorDVar(options)}
          />

          <Column
            field="growthDefectSeverity"
            header="Growth defect severity"
            body={(rowData) => (
              <TableRowBodyDVar dVar={rowData?.growthDefectSeverity} />
            )}
            editor={(options) => TextAreaRowEditorDVar(options)}
          />
          <Column
            field="knockdownLevel"
            header="Knockdown level"
            body={(rowData) => (
              <TableRowBodyDVar dVar={rowData?.knockdownLevel} />
            )}
            editor={(options) => TextAreaRowEditorDVar(options)}
          />
          <Column
            field="estimatedKnockdownRelativeToWT"
            header="Estimated knockdown relative to WT"
            body={(rowData) => (
              <TableRowBodyDVar
                dVar={rowData?.estimatedKnockdownRelativeToWT}
              />
            )}
            editor={(options) => TextAreaRowEditorDVar(options)}
          />

          <Column
            field="estimateBasedOn"
            header="Estimate based on"
            body={(rowData) => (
              <TableRowBodyDVar dVar={rowData?.estimateBasedOn} />
            )}
            editor={(options) => TextAreaRowEditorDVar(options)}
          />
          <Column
            field="selectivelySensitizesToOnTargetInhibitors"
            header="Selectively sensitizes to OnTargetInhibitors"
            body={(rowData) => (
              <TableRowBodyDVar
                dVar={rowData?.selectivelySensitizesToOnTargetInhibitors}
              />
            )}
            editor={(options) => TextAreaRowEditorDVar(options)}
          />
          <Column
            field="suitableForScreening"
            header="Suitable for screening"
            body={(rowData) => (
              <TableRowBodyDVar dVar={rowData?.suitableForScreening} />
            )}
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
