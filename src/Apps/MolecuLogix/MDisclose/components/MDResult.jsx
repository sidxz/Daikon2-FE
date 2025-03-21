import { observer } from "mobx-react-lite";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import SmilesView from "../../../../Library/SmilesView/SmilesView";
import MolDbAPI from "../../api/MolDbAPI";
const MDResult = ({ discloseValidated, results, setResults }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Disclosing molecules:", discloseValidated);
    MolDbAPI.discloseMolecules(discloseValidated)
      .then((res) => {
        console.log("Disclose Results:", res);
        setResults(res);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching disclosure results:", error);
        setLoading(false);
      });
  }, [discloseValidated]);
  if (loading) {
    return <div>Loading...</div>;
  }

  const StructureBodyTemplate = (rowData) => {
    return (
      <>
        <div
          className="flex flex-column"
          style={{ width: "250px", height: "290px" }}
        >
          <div className="flex w-full h-full">
            <SmilesView
              smiles={rowData?.smiles}
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
          <p className="text-2xl p-0 m-0">Disclosure Results</p>
        </div>
        <div className="flex w-full">
          <p className="text-md p-0 m-0">
            Attempted to disclose {discloseValidated?.length} compounds, Success{" "}
            {results?.length} compounds
          </p>
        </div>
      </div>
      <div className="flex w-full border-1 border-50 border-round surface-ground">
        <DataTable value={results} tableStyle={{ minWidth: "100rem" }}>
          <Column
            field={(rowData) => rowData.smiles}
            header="Structure"
            body={(rowData) => StructureBodyTemplate(rowData)}
          />
          <Column field={"name"} header={"Name"} />
          <Column field={"smiles"} header={"SMILES"} />
          <Column field={"formula"} header={"Formula"} />
          <Column field={"cLogP"} header={"cLogP"} />
          <Column field={"molecularWeight"} header={"Molecular Weight"} />
        </DataTable>
      </div>
    </div>
  );
};

export default observer(MDResult);
