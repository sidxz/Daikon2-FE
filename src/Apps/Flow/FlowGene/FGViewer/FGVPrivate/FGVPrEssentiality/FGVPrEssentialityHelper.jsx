import { Dropdown } from "primereact/dropdown";
import { classificationOptionsDVar } from "../../../constants/classificationOptions";

export const classificationEditor = (options) => {
  //console.log("classificationEditor options", options);
  return (
    <Dropdown
      id="classification"
      value={options.value}
      // options={[
      //   { name: "Essential", value: "Essential" },
      //   { name: "Essential-Domain", value: "Essential-Domain" },
      //   { name: "Growth-Advantage", value: "Growth-Advantage" },
      //   { name: "Growth-Defect", value: "Growth-Defect" },
      //   { name: "Non-Essential", value: "Non-Essential" },
      //   { name: "Uncertain", value: "Uncertain" },
      // ]}

      options={classificationOptionsDVar}
      onChange={(e) => options.editorCallback(e.target.value)}
      placeholder="Select a classification"
      optionLabel="name"
    />
  );
};
