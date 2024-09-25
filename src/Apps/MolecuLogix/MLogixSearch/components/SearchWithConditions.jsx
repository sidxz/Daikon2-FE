import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import React from "react";

const SearchWithConditions = ({ conditions, setConditions }) => {
  const properties = [
    { label: "Molecule Mass (g/mol)", value: "molecularWeight" },
    { label: "cLog P", value: "cLogP" },
    { label: "H-bond donors", value: "lipinskiHBD" },
    { label: "H-bond acceptors", value: "lipinskiHBA" },
    { label: "TPSA (Å²)", value: "tpsa" },
    { label: "Rotatable Bonds", value: "rotatableBonds" },
    { label: "Heavy Atoms", value: "heavyAtoms" },
    { label: "Aromatic Rings", value: "aromaticRings" },
    { label: "Rings", value: "rings" },
    // Add more properties as needed
  ];

  const addCondition = () => {
    setConditions([...conditions, { property: null, min: "", max: "" }]);
  };

  const removeCondition = (index) => {
    const updatedConditions = conditions.filter((_, i) => i !== index);
    setConditions(updatedConditions);
  };

  const handlePropertyChange = (value, index) => {
    const updatedConditions = [...conditions];
    updatedConditions[index].property = value;
    setConditions(updatedConditions);
  };

  const handleMinChange = (value, index) => {
    const updatedConditions = [...conditions];
    updatedConditions[index].min = value;
    setConditions(updatedConditions);
  };

  const handleMaxChange = (value, index) => {
    const updatedConditions = [...conditions];
    updatedConditions[index].max = value;
    setConditions(updatedConditions);
  };

  const getAvailableProperties = (selectedProperties) => {
    // Filter properties to exclude already selected ones
    return properties.filter(
      (property) => !selectedProperties.includes(property.value)
    );
  };

  return (
    <div className="p-3">
      {conditions.map((condition, index) => {
        // Collect all currently selected properties except the one for this condition
        const selectedProperties = conditions
          .filter((_, i) => i !== index)
          .map((cond) => cond.property);

        // Filter available properties for this condition
        const availableProperties = getAvailableProperties(selectedProperties);

        return (
          <div key={index} className="flex align-items-center mb-2 gap-2">
            <Dropdown
              className="p-inputtext-sm w-3"
              showClear
              value={condition.property}
              options={availableProperties}
              onChange={(e) => handlePropertyChange(e.value, index)}
              placeholder="(select property)"
              pt={{
                itemLabel: "text-sm",
              }}
            />
            <InputNumber
              showButtons
              mode="decimal"
              className="p-inputtext-sm w-2"
              value={condition.min}
              onValueChange={(e) => handleMinChange(e.target.value, index)}
              placeholder="Min"
              pt={{
                incrementButton: "p-button-text p-button-sm",
                decrementButton: "p-button-text p-button-sm",
              }}
              step={1}
            />
            <InputNumber
              showButtons
              mode="decimal"
              className="p-inputtext-sm w-2 p-button-text p-button-sm"
              value={condition.max}
              onValueChange={(e) => handleMaxChange(e.target.value, index)}
              placeholder="Max"
              pt={{
                incrementButton: "p-button-text p-button-sm",
                decrementButton: "p-button-text p-button-sm",
              }}
              step={1}
            />
            {index > 0 && (
              <Button
                icon="pi pi-minus"
                className="p-button-text p-button-sm"
                label="Remove term"
                onClick={() => removeCondition(index)}
              />
            )}
          </div>
        );
      })}
      <Button
        icon="pi pi-plus"
        label="Add Condition"
        className="p-button-text p-button-sm"
        onClick={addCondition}
      />
    </div>
  );
};

export default SearchWithConditions;
