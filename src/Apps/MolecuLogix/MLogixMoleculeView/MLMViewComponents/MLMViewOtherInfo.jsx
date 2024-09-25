import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Fieldset } from "primereact/fieldset";
import React from "react";

const MLMViewOtherInfo = ({ selectedMolecule }) => {
  let other1 = [
    {
      name: "Aliphatic Carbocycles",
      value: selectedMolecule.aliphaticCarbocycles,
    },
    {
      name: "Aliphatic Heterocycles",
      value: selectedMolecule.aliphaticHeterocycles,
    },
    {
      name: "Aliphatic Rings",
      value: selectedMolecule.aliphaticRings,
    },
  ];

  let other1b = [
    {
      name: "Aromatic Carbocycles",
      value: selectedMolecule.aromaticCarbocycles,
    },
    {
      name: "Aromatic Heterocycles",
      value: selectedMolecule.aromaticHeterocycles,
    },
    {
      name: "Aromatic Rings",
      value: selectedMolecule.aromaticRings,
    },
  ];

  let other2 = [
    {
      name: "Saturated Carbocycles",
      value: selectedMolecule.saturatedCarbocycles,
    },
    {
      name: "Saturated Heterocycles",
      value: selectedMolecule.saturatedHeterocycles,
    },
    {
      name: "Saturated Rings",
      value: selectedMolecule.saturatedRings,
    },
  ];

  let other2b = [
    {
      name: "Rings",
      value: selectedMolecule.rings,
    },
    {
      name: "Rotatable Bonds",
      value: selectedMolecule.rotatableBonds,
    },

    {
      name: "Formula",
      value: selectedMolecule.formula,
    },
  ];

  let other3 = [
    {
      name: "FsP3",
      value: selectedMolecule.fsP3,
    },
    {
      name: "Heavy Atoms",
      value: selectedMolecule.heavyAtoms,
    },
    {
      name: "Hetero Atoms",
      value: selectedMolecule.heteroAtoms,
    },
  ];

  let other3b = [
    {
      name: "QED",
      value: selectedMolecule.qed,
    },
    {
      name: "Radical Electrons",
      value: selectedMolecule.radicalElectrons,
    },
    {
      name: "SAS",
      value: selectedMolecule.sas,
    },
  ];

  return (
    <div className="flex pt-2 w-full">
      <Fieldset className="m-0 flex-grow-1 w-full" legend="Other Information">
        <div className="flex w-full gap-2">
          <div className="flex">
            <DataTable
              value={other1}
              className="HideDataTableHeader"
              size="small"
            >
              <Column className="font-normal" field="name"></Column>
              <Column field="value"></Column>
            </DataTable>
          </div>
          <div className="flex">
            <DataTable
              value={other1b}
              className="HideDataTableHeader"
              size="small"
            >
              <Column className="font-normal" field="name"></Column>
              <Column field="value"></Column>
            </DataTable>
          </div>
          <div className="flex">
            <DataTable
              value={other2}
              className="HideDataTableHeader"
              size="small"
            >
              <Column className="font-normal" field="name"></Column>
              <Column field="value"></Column>
            </DataTable>
          </div>
          <div className="flex">
            <DataTable
              value={other2b}
              className="HideDataTableHeader"
              size="small"
            >
              <Column className="font-normal" field="name"></Column>
              <Column
                field="value"
                body={(rowData) =>
                  rowData.name == "Formula"
                    ? rowData.value.split(/(\d+)/).map((part, index) => {
                        // If it's a number, wrap it in a <sub> tag
                        if (!isNaN(part)) {
                          return <sub key={index}>{part}</sub>;
                        }
                        // Otherwise, just return the element as it is
                        return <span key={index}>{part}</span>;
                      })
                    : rowData.value
                }
              ></Column>
            </DataTable>
          </div>

          <div className="flex">
            <DataTable
              value={other3}
              className="HideDataTableHeader"
              size="small"
            >
              <Column className="font-normal" field="name"></Column>
              <Column field="value"></Column>
            </DataTable>
          </div>
          <div className="flex">
            <DataTable
              value={other3b}
              className="HideDataTableHeader"
              size="small"
            >
              <Column className="font-normal" field="name"></Column>
              <Column field="value"></Column>
            </DataTable>
          </div>
        </div>
      </Fieldset>
    </div>
  );
};

export default MLMViewOtherInfo;
