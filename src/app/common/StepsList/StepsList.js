import React from "react";

const StepsList = ({ steps }) => {
  return (
    <div className="flex w-full steps-container">
      <ul>
        {steps.map((step, index) => {
          if (step.value.trim() !== "") {
            return <li key={index}>{step.value}</li>;
          }
          return null;
        })}
      </ul>
    </div>
  );
};

export default StepsList;

// Usage:
// <StepsList steps={steps} />
