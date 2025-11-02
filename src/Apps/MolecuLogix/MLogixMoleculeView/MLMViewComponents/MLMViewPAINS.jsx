import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Fieldset } from "primereact/fieldset";
import { Tag } from "primereact/tag";

const MLMViewPAINS = ({ selectedMolecule }) => {
  let painsFlags = [
    {
      name: "RDKit Pains Flag",
      value: selectedMolecule?.pains?.rdKitPains,
    },
  ];

  let painsLabel = [
    {
      name: "RDKit Pains Label",
      value: selectedMolecule?.pains?.rdKitPainsLabels?.join(", "),
    },
  ];

  let boolValueTemplate = (rowData) => {
    if (rowData.value === true) {
      return <Tag severity="danger" value="True"></Tag>;
    }
    return <Tag severity="success" value="False"></Tag>;
  };

  return (
    <div className="flex pt-2 w-full">
      <Fieldset className="m-0 flex-grow-1 w-full" legend="PAINS Filter">
        <div className="flex flex-column w-full gap-2">
          <div className="flex">
            <DataTable
              value={painsFlags}
              className="HideDataTableHeader"
              size="small"
            >
              <Column className="font-normal" field="name"></Column>
              <Column field="value" body={boolValueTemplate}></Column>
            </DataTable>
          </div>
          <div className="flex">
            <DataTable
              value={painsLabel}
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

export default MLMViewPAINS;
