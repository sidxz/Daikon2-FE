import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MDInput from "./components/MDInput";
import MDPreview from "./components/MDPreview";
import MDResult from "./components/MDResult";

const MDisclose = () => {
  const stepperRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams(); // ✅ Get and set URL parameters

  // ✅ Extract `inputName` from URL (can be string or array)
  const inputNameParam = searchParams.getAll("inputName");

  // ✅ Initialize state based on URL or default
  const [inputs, setInputs] = useState(() => {
    if (inputNameParam.length > 0) {
      return inputNameParam.map((name) => ({
        name: name.trim(),
        SMILES: "Click to Edit",
        CDDId: "",
      }));
    }
    return [{ name: "Click to Edit", SMILES: "Click to Edit", CDDId: "" }];
  });

  /**
   * Keeps URL in sync with `inputs` state.
   */
  useEffect(() => {
    const validNames = inputs
      .map((input) => input.name.trim())
      .filter((name) => name !== "" && name !== "Click to Edit");

    setSearchParams({ inputName: validNames }, { replace: true });
  }, [inputs, setSearchParams]);

  /**
   * Removes invalid or placeholder input fields.
   */
  const removeEmptyFields = useCallback(() => {
    setInputs((prevInputs) => {
      const filteredInputs = prevInputs.filter(
        (input) =>
          input.name.trim() !== "" &&
          input.SMILES.trim() !== "" &&
          input.name !== "Click to Edit" &&
          input.SMILES !== "Click to Edit"
      );

      console.log("Filtered inputs:", filteredInputs); // ✅ Log after state updates
      return filteredInputs;
    });
  }, []);

  /**
   * Moves to the next step after filtering inputs.
   */
  const moveToPreview = () => {
    removeEmptyFields();
    if (stepperRef.current) {
      stepperRef.current.nextCallback();
    }
  };

  return (
    <div className="flex justify-content-center w-full">
      <Stepper ref={stepperRef} style={{ flexBasis: "100rem" }}>
        {/* Step 1: Input */}
        <StepperPanel header="Input">
          <div className="flex flex-column h-12rem">
            <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
              <MDInput inputs={inputs} setInputs={setInputs} />
            </div>
          </div>
          <div className="flex pt-4 justify-content-end">
            <Button
              label="Next"
              icon="pi pi-arrow-right"
              iconPos="right"
              onClick={moveToPreview}
            />
          </div>
        </StepperPanel>

        {/* Step 2: Preview */}
        <StepperPanel header="Preview">
          <div className="flex flex-column h-12rem">
            <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
              <MDPreview inputs={inputs} setInputs={setInputs} />
            </div>
          </div>
          <div className="flex pt-4 justify-content-between">
            <Button
              label="Back"
              severity="secondary"
              icon="pi pi-arrow-left"
              onClick={() => stepperRef.current?.prevCallback()}
            />
            <Button
              label="Next"
              icon="pi pi-arrow-right"
              iconPos="right"
              onClick={() => stepperRef.current?.nextCallback()}
            />
          </div>
        </StepperPanel>

        {/* Step 3: Result */}
        <StepperPanel header="Result">
          <div className="flex flex-column h-12rem">
            <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
              <MDResult />
            </div>
          </div>
          <div className="flex pt-4 justify-content-start">
            <Button
              label="Back"
              severity="secondary"
              icon="pi pi-arrow-left"
              onClick={() => stepperRef.current?.prevCallback()}
            />
          </div>
        </StepperPanel>
      </Stepper>
    </div>
  );
};

export default observer(MDisclose);
