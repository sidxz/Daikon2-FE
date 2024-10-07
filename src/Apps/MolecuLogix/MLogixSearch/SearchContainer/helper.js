// Function to extract conditions from URL query params
export const extractConditionsFromUrl = (searchParams) => {
  const newConditions = [];

  searchParams.forEach((value, key) => {
    // Detect condition parameters (ends with "Min" or "Max")
    if (key.endsWith("Min") || key.endsWith("Max")) {
      const property = key.replace(/Min|Max/, "");
      const isMin = key.endsWith("Min");
      const existingCondition = newConditions.find(
        (condition) => condition.property === property
      );

      if (existingCondition) {
        existingCondition[isMin ? "min" : "max"] = value;
      } else {
        newConditions.push({
          property,
          min: isMin ? value : "",
          max: isMin ? "" : value,
        });
      }
    }
  });

  return newConditions.length > 0
    ? newConditions
    : [{ property: null, min: "", max: "" }];
};
