import { InputTextarea } from "primereact/inputtextarea";

export const TextAreaRowEditorDVar = (options) => {
  let onchangeDVar = (e) => {
    let value = { value: e.target.value };
    options.editorCallback(value);
  };

  return (
    <InputTextarea
      autoResize
      className="w-full"
      type="text"
      value={options.value ? options.value.value : ""}
      onChange={(e) => onchangeDVar(e)}
    />
  );
};
