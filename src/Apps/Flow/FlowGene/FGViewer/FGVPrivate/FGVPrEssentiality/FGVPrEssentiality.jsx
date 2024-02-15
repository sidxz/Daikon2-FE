import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useState } from "react";
import EmbeddedHelp from "../../../../../../Library/EmbeddedHelp/EmbeddedHelp";
import { TextAreaRowEditor } from "../../../../../../Shared/TableRowEditors/TextAreaRowEditor";
import * as Helper from "./FGVPrEssentialityHelper";

const FGVPrEssentiality = ({ selectedGene }) => {
  const [tableData, setTableData] = useState([...selectedGene.essentialities]);

  const [displayAddSideBar, setDisplayAddSideBar] = useState(false);

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

  return (
    <>
      <DataTable
        value={tableData}
        editMode="row"
        dataKey="id"
        header={tableHeader}
      >
        <Column
          field="classification"
          header="Classification"
          editor={(options) => Helper.classificationEditor(options)}
        />
        <Column
          field="condition"
          header="Condition"
          editor={(options) => TextAreaRowEditor(options)}
        />
        <Column
          field="method"
          header="Method"
          editor={(options) => TextAreaRowEditor(options)}
        />
        <Column
          field="reference"
          header="Reference"
          editor={(options) => TextAreaRowEditor(options)}
        />
        <Column
          field="notes"
          header="Notes"
          editor={(options) => TextAreaRowEditor(options)}
        />
        <Column
          rowEditor
          headerStyle={{ width: "10%", minWidth: "8rem" }}
          bodyStyle={{ textAlign: "center" }}
        />
      </DataTable>
    </>
  );
};

export default FGVPrEssentiality;
