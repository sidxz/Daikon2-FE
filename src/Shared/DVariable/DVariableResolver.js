export const DVariableResolver = (dVariable) => {
  // Check if 'dVariable' is an object, not null, and has either 'value' or 'Value' property
  if (
    typeof dVariable === "object" &&
    dVariable !== null &&
    ("value" in dVariable || "Value" in dVariable)
  ) {
    // Return the value, preferring 'value' over 'Value' if both exist
    return "value" in dVariable ? dVariable.value : dVariable.Value;
  } else {
    // If 'dVariable' is not an object or doesn't have 'value'/'Value', return it directly
    return dVariable;
  }
};
