import { Dropdown } from "primereact/dropdown";

export const orgDropDownOptions = [
  { name: "TAMU", value: "Texas A&M" },
  { name: "AbbVie", value: "AbbVie" },
];
export const orgDropDown = (options) => {
  return (
    <Dropdown
      id="organization"
      value={options.value}
      options={orgDropDownOptions}
      onChange={(e) => options.editorCallback(e.target.value)}
      placeholder="Select an organization"
      optionLabel="name"
    />
  );
};
