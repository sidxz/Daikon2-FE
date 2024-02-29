import { InputText } from "primereact/inputtext";

export const TextRowEditor = (options) => {
  return (
    <InputText
      autoResize
      className="w-full"
      type="text"
      value={options.value}
      onChange={(e) => options.editorCallback(e.target.value)}
    />
  );
};
