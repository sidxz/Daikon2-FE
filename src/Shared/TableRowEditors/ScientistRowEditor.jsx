import InputScientist from "../InputEditors/InputScientist";

export const ScientistRowEditor = (options) => {
  return (
    <InputScientist
      autoResize
      className="w-full"
      type="text"
      value={options.value}
      onChange={(e) => options.editorCallback(e.target.value)}
    />
  );
};
