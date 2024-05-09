import { MultiSelect } from "primereact/multiselect";
import React from "react";

const MultiSelectFilter = ({
  data,
  filterProperty,
  options,
  placeholder,
  labelMapper = (label) => label,
}) => {
  const filterOptionsValue = [
    ...new Set(
      data
        .filter((item) => item[filterProperty] != null)
        .map((item) => item[filterProperty])
    ),
  ];
  const filterOptions = filterOptionsValue.map((item) => {
    return { label: labelMapper(item), value: item };
  });

  console.log("filterOptions", filterOptions);

  return (
    <MultiSelect
      value={options.value}
      optionLabel="label"
      optionValue="value"
      options={filterOptions}
      onChange={(e) => options.filterApplyCallback(e.value)}
      placeholder={placeholder || "Select a filter"}
      className="p-column-filter"
      showClear
    />
  );
};

export default MultiSelectFilter;
