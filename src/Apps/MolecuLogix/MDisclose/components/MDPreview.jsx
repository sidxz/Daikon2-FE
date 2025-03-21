import { observer } from "mobx-react-lite";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tag } from "primereact/tag";
import React, { useEffect, useState } from "react";
import SmilesView from "../../../../Library/SmilesView/SmilesView";
import MolDbAPI from "../../api/MolDbAPI";
const MDPreview = ({
  inputs,
  setInputs,
  previewResults,
  setPreviewResults,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    MolDbAPI.discloseMoleculePreview(inputs)
      .then((res) => {
        console.log("Preview Results:", res);
        setPreviewResults(res);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching molecule preview:", error);
        setLoading(false);
      });
  }, [inputs]);
  if (loading) {
    return <div>Loading...</div>;
  }

  const ValidityBodyTemplate = (rowData) => {
    return (
      <>
        {rowData.isValid ? (
          <Tag severity="info" value="OK"></Tag>
        ) : (
          <Tag severity="danger" value="Error"></Tag>
        )}
      </>
    );
  };

  const StructureBodyTemplate = (rowData) => {
    return (
      <>
        <div
          className="flex flex-column"
          style={{ width: "250px", height: "290px" }}
        >
          <div className="flex w-full h-full">
            <SmilesView
              smiles={rowData?.requestedSMILES}
              compoundId={rowData?.id}
              width={250}
              height={270}
            />
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-column justify-content-center align-items-center w-11 gap-2">
      <div className="flex flex-column w-full gap-1">
        <div className="flex w-full">
          <p className="text-2xl p-0 m-0">Disclosure Data Preview</p>
        </div>
        <div className="flex w-full">
          <p className="text-md p-0 m-0">
            This table checks your input. Only the rows without errors will be
            submitted for disclosure.
          </p>
        </div>
      </div>
      <div className="flex w-full border-1 border-50 border-round surface-ground">
        <DataTable
          value={previewResults}
          tableStyle={{ minWidth: "100rem" }}
          className="w-full"
        >
          <Column
            field={(rowData) => rowData.requestedSMILES}
            header="Structure"
            body={(rowData) => StructureBodyTemplate(rowData)}
          />
          <Column field={"name"} header={"Name"} />
          <Column
            field={"requestedSMILES"}
            header={"SMILES"}
            className="flex-wrap text-wrap white-space-normal"
          />
          <Column
            field={"isValid"}
            header={"Validity"}
            body={ValidityBodyTemplate}
          />
          <Column
            field={"errors"}
            header={"Errors"}
            body={(field) => field.errors?.join(", ") || "No Errors"}
            className="flex-wrap text-wrap white-space-normal"
            style={{
              wordWrap: "break-word",
            }}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default observer(MDPreview);
