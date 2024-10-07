import { saveAs } from "file-saver";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { TabPanel, TabView } from "primereact/tabview";
import React from "react";
const MLMViewIdentifiers = ({ selectedMolecule }) => {
  const downloadMolFile = (molblock, fileName = "molecule.mol") => {
    const blob = new Blob([molblock], { type: "chemical/x-mdl-molfile" });
    saveAs(blob, fileName);
  };

  let identifiers = [
    {
      name: "SMILES Canonical",
      value: selectedMolecule.smilesCanonical,
    },
    {
      name: "SMILES",
      value: selectedMolecule.smiles,
    },
    {
      name: "SMARTS",
      value: selectedMolecule.smarts,
    },

    {
      name: "Selfies",
      value: selectedMolecule.selfies,
    },
    {
      name: "InChI",
      value: selectedMolecule.inchi,
    },
    {
      name: "InChIKey",
      value: selectedMolecule.inchiKey,
    },
  ];

  return (
    <div className="flex mt-3 border-3 border-50 border-round-md w-full">
      {/* <Fieldset className="m-0 flex-grow-1" legend="Identifiers"> */}
      <TabView>
        <TabPanel header="Identifiers">
          <div className="flex">
            <DataTable value={identifiers} className="HideDataTableHeader">
              <Column className="font-normal" field="name"></Column>
              <Column
                style={{ wordBreak: "break-all" }}
                className="w-full"
                field="value"
                body={(rowData) => (
                  <InputText
                    value={rowData.value}
                    readOnly
                    size={40}
                    className="w-full border-1"
                  />
                )}
              ></Column>
            </DataTable>
          </div>
        </TabPanel>
        <TabPanel header="Molfile">
          <div className="flex flex-column">
            <div className="flex">
              <InputTextarea
                className="border-0"
                value={selectedMolecule.stdMolblock}
                rows={18}
                cols={60}
                readOnly
              />
            </div>
            <div className="flex align-items-right justify-content-end">
              <Button
                className="border-0 m-1 p-0 p-button-sm p-button-link"
                label="Download Molfile"
                onClick={() =>
                  downloadMolFile(
                    selectedMolecule.stdMolblock,
                    `${selectedMolecule.name}.mol`
                  )
                }
              />
            </div>
          </div>
        </TabPanel>
        <TabPanel header="Original">
          <div className="flex flex-column">
            <div className="flex">
              <InputTextarea
                className="border-0"
                value={selectedMolecule.oMolblock}
                rows={18}
                cols={60}
                readOnly
              />
            </div>
            <div className="flex align-items-right justify-content-end">
              <Button
                className="border-0 m-1 p-0 p-button-sm p-button-link"
                label="Download Molfile"
                onClick={() =>
                  downloadMolFile(
                    selectedMolecule.stdMolblock,
                    `${selectedMolecule.name}.mol`
                  )
                }
              />
            </div>
          </div>
        </TabPanel>
      </TabView>
      {/* </Fieldset> */}
    </div>
  );
};

export default MLMViewIdentifiers;
