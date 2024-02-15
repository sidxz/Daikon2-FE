import { Dropdown } from "primereact/dropdown";

export const classificationEditor = (options) => {
  return (
    <Dropdown
      id="classification"
      value={options.value}
      options={[
        { name: "Essential", value: "Essential" },
        { name: "Essential-Domain", value: "Essential-Domain" },
        { name: "Growth-Advantage", value: "Growth-Advantage" },
        { name: "Growth-Defect", value: "Growth-Defect" },
        { name: "Non-Essential", value: "Non-Essential" },
        { name: "Uncertain", value: "Uncertain" },
      ]}
      onChange={(e) => options.editorCallback(e.target.value)}
      placeholder="Select a classification"
      optionLabel="name"
    />
  );
};
