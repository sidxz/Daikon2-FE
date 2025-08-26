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
import { OrgRowEditorDVar } from "../../../../../../Shared/TableRowEditorsDVar/OrgRowEditorDVar";
import { TextAreaRowEditorDVar } from "../../../../../../Shared/TableRowEditorsDVar/TextAreaRowEditorDVar";
import FGVPrUnpublishedStructuralInformationAddForm from "./FGVPrUnpublishedStructuralInformationAddForm";

const FGVPrUnpublishedStructuralInformation = ({ selectedGene }) => {
  const [displayAddSideBar, setDisplayAddSideBar] = useState(false);
  const rootStore = useContext(RootStoreContext);
  const {
    isAddingUnpublishedStructuralInformation,
    addUnpublishedStructuralInformation,
    isUpdatingUnpublishedStructuralInformation,
    updateUnpublishedStructuralInformation,
    deleteUnpublishedStructuralInformation,
    isDeletingUnpublishedStructuralInformation,
  } = rootStore.geneUnpublishedStructuralInformationStore;

  const tableHeader = (
    <div className="table-header">
      <div className="flex justify-content-end">
        <div className="flex">
          <EmbeddedHelp>
            Structures that are not published yet. Data: Organization (For e.g
            TAMU | Researcher name) | Method (For e.g - X-ray/Cryo-em/NMR) |
            Resolution (For e.g - 4A) | Ligands (For e.g - SAC-ID\Smile
            String\Link to the structure)
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
      <span className="font-bold">Add Unpublished Structural Information</span>
    </div>
  );
  const deleteBodyTemplate = (rowData) => {
    const accept = () => {
      // Delete unpublishedStructuralInformation
      deleteUnpublishedStructuralInformation(rowData.id);
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
          isUpdatingUnpublishedStructuralInformation ||
          isDeletingUnpublishedStructuralInformation
        }
      >
        <DataTable
          value={selectedGene.unpublishedStructuralInformations}
          editMode="row"
          dataKey="id"
          showGridlines
          removableSort
          header={tableHeader}
          onRowEditComplete={(e) =>
            updateUnpublishedStructuralInformation(e.newData)
          }
        >
          <Column
            header="#"
            body={(data, options) => options.rowIndex + 1}
          ></Column>
          <Column
            field="organization"
            header="Organization"
            body={(rowData) => (
              <TableRowBodyDVar dVar={rowData?.organization} isOrg={true} />
            )}
            sortable
            editor={(options) => OrgRowEditorDVar(options)}
          />

          <Column
            field="method"
            header="Method"
            body={(rowData) => <TableRowBodyDVar dVar={rowData?.method} />}
            editor={(options) => TextAreaRowEditorDVar(options)}
          />
          <Column
            field="resolution"
            header="Resolution"
            body={(rowData) => <TableRowBodyDVar dVar={rowData?.resolution} />}
            editor={(options) => TextAreaRowEditorDVar(options)}
          />
          <Column
            field="url"
            header="URL"
            body={(rowData) => <TableRowBodyDVar dVar={rowData?.url} />}
            editor={(options) => TextAreaRowEditorDVar(options)}
          />
          <Column
            field="ligands"
            header="Ligands"
            body={(rowData) => <TableRowBodyDVar dVar={rowData?.ligands} />}
            editor={(options) => TextAreaRowEditorDVar(options)}
          />
          <Column
            field="reference"
            header="Reference"
            body={(rowData) => <TableRowBodyDVar dVar={rowData?.reference} />}
            editor={(options) => TextAreaRowEditorDVar(options)}
          />

          <Column
            field="researcher"
            header="Researcher"
            body={(rowData) => <TableRowBodyDVar dVar={rowData?.researcher} />}
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
        <FGVPrUnpublishedStructuralInformationAddForm
          selectedGene={selectedGene}
          isAddingUnpublishedStructuralInformation={
            isAddingUnpublishedStructuralInformation
          }
          addUnpublishedStructuralInformation={
            addUnpublishedStructuralInformation
          }
          closeSidebar={() => setDisplayAddSideBar(false)}
        />
      </Sidebar>
    </>
  );
};

export default observer(FGVPrUnpublishedStructuralInformation);
