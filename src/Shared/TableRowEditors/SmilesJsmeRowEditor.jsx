import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useMemo, useState } from "react";
import JSMEditor from "../../Library/JSME/JSMEditor";
import SmilesView from "../../Library/SmilesView/SmilesView";

const SmilesJsmeRowEditor = ({ options }) => {
  const [open, setOpen] = useState(false);
  const normalize = (s) => (s ?? "").toString().trim();

  // PrimeReact passes the current cell value in options.value
  const currentSmiles = useMemo(
    () => normalize(options.value ?? ""),
    [options.value],
  );

  const onSave = (newSmiles) => {
    const cleaned = normalize(newSmiles ?? "");
    options.editorCallback(cleaned);
    setOpen(false);
  };

  return (
    <div className="flex flex-column gap-2" style={{ minWidth: 260 }}>
      {/* lightweight preview */}
      <div className="border-1 surface-border border-round p-2">
        <SmilesView smiles={currentSmiles} width={240} height={220} />
      </div>

      <div className="flex gap-2 w-full">
        <InputText
          className="w-full"
          placeholder="SMILES"
          value={currentSmiles}
          onChange={(e) => onSave(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          size="small"
          label={currentSmiles ? "Edit Structure" : "Add Structure"}
          icon="pi pi-pencil"
          onClick={() => setOpen(true)}
        />
        <Button
          type="button"
          size="small"
          severity="secondary"
          label="Clear"
          icon="pi pi-times"
          onClick={() => options.editorCallback("")}
        />
      </div>

      <Dialog
        visible={open}
        modal
        closable
        header="Structure Editor"
        style={{ width: "56rem", maxWidth: "95vw" }}
        onHide={() => setOpen(false)}
      >
        <div className="pt-2">
          <JSMEditor initialSmiles={currentSmiles} onSave={onSave} />
        </div>
      </Dialog>
    </div>
  );
};

export default SmilesJsmeRowEditor;
