/**
 * Format non-empty bioactivity fields with units
 * @param {Object} bioActivity
 * @returns {Array<{ label: string, value: string }>}
 */
export const formatBioActivity = (bioActivity) => {
  if (!bioActivity || typeof bioActivity !== "object") return [];

  const fieldsWithUnits = [
    { field: "iC50", unit: "iC50Unit", label: "IC₅₀" },
    { field: "eC50", unit: "eC50Unit", label: "EC₅₀" },
    { field: "ki", unit: "kiUnit", label: "Kᵢ" },
    { field: "kd", unit: "kdUnit", label: "K_d" },
    { field: "mic", unit: "micUnit", label: "MIC" },
    { field: "miC90", unit: "miC90Unit", label: "MIC₉₀" },
    { field: "gI50", unit: "gI50Unit", label: "GI₅₀" },
    { field: "tgi", unit: "tgiUnit", label: "TGI" },
    { field: "lD50", unit: "lD50Unit", label: "LD₅₀" },
    {
      field: "pctInhibition",
      unit: "pctInhibitionConcentrationUnit",
      label: "% Inhibition",
      concentrationField: "pctInhibitionConcentration",
    },
  ];

  const formatted = [];

  for (const entry of fieldsWithUnits) {
    const value = bioActivity[entry.field];
    const unit = bioActivity[entry.unit];
    const concentration = entry.concentrationField
      ? bioActivity[entry.concentrationField]
      : null;

    if (value && value.toString().trim() !== "") {
      let formattedValue = `${value}`;
      if (concentration && concentration.toString().trim() !== "") {
        formattedValue += ` @ ${concentration}`;
        if (unit && unit.trim() !== "") {
          formattedValue += ` ${unit}`;
        }
      } else if (unit && unit.trim() !== "") {
        formattedValue += ` ${unit}`;
      }

      formatted.push({
        label: entry.label,
        value: formattedValue,
      });
    }
  }

  return formatted;
};
