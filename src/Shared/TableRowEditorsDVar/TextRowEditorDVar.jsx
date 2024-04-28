import { InputText } from "primereact/inputtext";

export const TextRowEditorDVar = (options) => {
  let onchangeDVar = (e) => {
    let value = { value: e.target.value };
    options.editorCallback(value);
  };

  return (
    <InputText
      className="w-full"
      type="text"
      value={options.value.value}
      onChange={(e) => onchangeDVar(e)}
    />
  );
};
