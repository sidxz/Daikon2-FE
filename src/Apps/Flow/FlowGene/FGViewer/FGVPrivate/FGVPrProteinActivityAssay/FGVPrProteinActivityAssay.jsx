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
import FGVPrProteinActivityAssayAddForm from "./FGVPrProteinActivityAssayAddForm";

const FGVPrProteinActivityAssay = ({ selectedGene }) => {
  const [displayAddSideBar, setDisplayAddSideBar] = useState(false);
  const rootStore = useContext(RootStoreContext);
  const {
    isAddingProteinActivityAssay,
    addProteinActivityAssay,
    isUpdatingProteinActivityAssay,
    updateProteinActivityAssay,
    deleteProteinActivityAssay,
    isDeletingProteinActivityAssay,
  } = rootStore.geneProteinActivityAssayStore;

  const tableHeader = (
    <div className="table-header">
      <div className="flex justify-content-end">
        <div className="flex">
          <EmbeddedHelp>
            Protein activity assays are commonly used in drug discovery to
            evaluate the efficacy of potential drug compounds in modulating the
            activity of specific target proteins. These assays are designed to
            measure the activity of a protein in the presence of a test
            compound, and they can provide valuable information about the
            potential therapeutic effects of a drug candidate. Data: | Assay
            (Describe the assay -For e.g Flouroscent polarization assay) |
            Method (How the assay is run?) | Throughput (For e.g - Low /High)
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
      <span className="font-bold">Add Protein Activity Assay</span>
    </div>
  );
  const deleteBodyTemplate = (rowData) => {
    const accept = () => {
      // Delete proteinActivityAssay
      deleteProteinActivityAssay(rowData.id);
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
        blocked={
          isUpdatingProteinActivityAssay || isDeletingProteinActivityAssay
        }
      >
        <DataTable
          value={selectedGene.proteinActivityAssays}
          editMode="row"
          dataKey="id"
          showGridlines
          removableSort
          size="small"
          header={tableHeader}
          onRowEditComplete={(e) => updateProteinActivityAssay(e.newData)}
        >
          <Column
            header="#"
            body={(data, options) => options.rowIndex + 1}
          ></Column>
          <Column
            field="assay"
            header="Assay"
            body={(rowData) => <TableRowBodyDVar dVar={rowData?.assay} />}
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
            field="url"
            header="URL"
            body={(rowData) => <TableRowBodyDVar dVar={rowData?.url} />}
            editor={(options) => TextAreaRowEditorDVar(options)}
          />
          <Column
            field="throughput"
            header="Throughput"
            body={(rowData) => <TableRowBodyDVar dVar={rowData?.throughput} />}
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
        <FGVPrProteinActivityAssayAddForm
          selectedGene={selectedGene}
          isAddingProteinActivityAssay={isAddingProteinActivityAssay}
          addProteinActivityAssay={addProteinActivityAssay}
          closeSidebar={() => setDisplayAddSideBar(false)}
        />
      </Sidebar>
    </>
  );
};

export default observer(FGVPrProteinActivityAssay);
