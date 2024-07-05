import React from "react";
import "./FTVApconixGrid.css";

const FTVApconixGrid = () => {
    const data = [
        { name: "Carcinogenesis", risk: "", impact: "", likelihood: "" },
        { name: "Cardiovascular", risk: "", impact: "", likelihood: "" },
        { name: "Endocrine", risk: "", impact: "", likelihood: "" },
        { name: "Gastrointestinal", risk: "", impact: "", likelihood: "" },
        { name: "Hematological and Immune", risk: "", impact: "", likelihood: "" },
        { name: "Hepatobiliary ", risk: "", impact: "", likelihood: "" },
        { name: "Integumentary ", risk: "", impact: "", likelihood: "" },
        { name: "Nervous", risk: "", impact: "", likelihood: "" },
        { name: "Embryofetal Developmental Toxicity", risk: "", impact: "", likelihood: "" },
        { name: "Reproductive Female ", risk: "", impact: "", likelihood: "" },
        { name: "Reproductive Male ", risk: "", impact: "", likelihood: "" },
        { name: "Respiratory", risk: "", impact: "", likelihood: "" },
        { name: "Sensory", risk: "", impact: "", likelihood: "" },
        { name: "Urinary", risk: "", impact: "", likelihood: "" },
      ];
  return (
    <div className="apconixGrid">
      <table className="apconixGrid">
      <thead>
        <tr>
          <th></th>
          <th>Risk</th>
          <th>Impact</th>
          <th>Likelihood (Likelihood of risk occurring assuming mammalian target modulation)</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td>{row.name}</td>
            <td>{row.risk}</td>
            <td>{row.impact}</td>
            <td>{row.likelihood}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
};

export default FTVApconixGrid;
