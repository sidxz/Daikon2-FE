import { InputTextarea } from "primereact/inputtextarea";

export const TextAreaRowEditor = (options) => {
  return (
    <InputTextarea
      autoResize
      className="w-full"
      type="text"
      value={options.value}
      onChange={(e) => options.editorCallback(e.target.value)}
    />
  );
};
