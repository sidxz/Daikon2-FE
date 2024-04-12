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
import { TextAreaRowEditor } from "../../../../../../Shared/TableRowEditors/TextAreaRowEditor";
import FGVPrCrispriStrainAddForm from "./FGVPrCrispriStrainAddForm";

const FGVPrCrispriStrain = ({ selectedGene }) => {
  const [displayAddSideBar, setDisplayAddSideBar] = useState(false);
  const rootStore = useContext(RootStoreContext);
  const {
    isAddingCrispriStrain,
    addCrispriStrain,
    isUpdatingCrispriStrain,
    updateCrispriStrain,
    deleteCrispriStrain,
    isDeletingCrispriStrain,
  } = rootStore.geneCrispriStrainStore;

  const tableHeader = (
    <div className="table-header">
      <div className="flex justify-content-end">
        <div className="flex">
          <EmbeddedHelp>
            The CRISPRi Strain List is a collection of bacterial strains that
            have been genetically modified to enable the use of CRISPR
            interference (CRISPRi) for gene expression control. These strains
            can be used in drug discovery to investigate the roles of specific
            genes and pathways in bacterial physiology and pathogenesis.
          </EmbeddedHelp>
        </div>
        <div className="flex flex-grow min-w-max">
          <Button
            type="button"
            icon="icon icon-common icon-plus-circle"
            label="Add Crispri Strain"
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
      <span className="font-bold">Add Crispri Strain</span>
    </div>
  );
  const deleteBodyTemplate = (rowData) => {
    const accept = () => {
      // Delete crispriStrain
      deleteCrispriStrain(rowData.id);
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
      <BlockUI blocked={isUpdatingCrispriStrain || isDeletingCrispriStrain}>
        <DataTable
          value={selectedGene.crispriStrains}
          editMode="row"
          dataKey="id"
          showGridlines
          removableSort
          header={tableHeader}
          onRowEditComplete={(e) => updateCrispriStrain(e.newData)}
        >
          <Column
            field="crispriStrainName"
            header="Crispri Strain Name"
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
        <FGVPrCrispriStrainAddForm
          selectedGene={selectedGene}
          isAddingCrispriStrain={isAddingCrispriStrain}
          addCrispriStrain={addCrispriStrain}
          closeSidebar={() => setDisplayAddSideBar(false)}
        />
      </Sidebar>
    </>
  );
};

export default observer(FGVPrCrispriStrain);
