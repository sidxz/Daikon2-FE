import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { appColors } from "../../../constants/colors";
import SecHeading from "../../../Library/SecHeading/SecHeading";
import { DiscloseIcon } from "../Icons/DiscloseIcon";
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
        disclosureScientist: "Click to Edit",
        disclosureReason: "Click to Edit",
        disclosureStage: "Click to Edit",
        disclosureNotes: "Click to Edit",
        literatureReferences: "Click to Edit",
      }));
    }
    return [
      {
        name: "Click to Edit",
        SMILES: "Click to Edit",
        disclosureScientist: "Click to Edit",
        disclosureReason: "Click to Edit",
        disclosureStage: "Click to Edit",
        disclosureNotes: "Click to Edit",
        literatureReferences: "Click to Edit",
      },
    ];
  });

  const [previewResults, setPreviewResults] = useState([]);
  const [discloseValidated, setDiscloseValidated] = useState([]);
  const [results, setResults] = useState([]);

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
          input.SMILES !== "Click to Edit" &&
          input.disclosureScientist !== "Click to Edit" &&
          input.disclosureReason !== "Click to Edit" &&
          input.disclosureStage !== "Click to Edit" &&
          input.disclosureNotes !== "Click to Edit" &&
          input.literatureReferences !== "Click to Edit"
      );

      console.log("Filtered inputs:", filteredInputs); // ✅ Log after state updates
      return filteredInputs;
    });
  }, []);

  /**
   * Validate and filter the preview results, valid if isValid is true and populate discloseValidated
   *
   */
  useEffect(() => {
    const filteredResults = previewResults.filter(
      (result) => result.isValid === true
    );
    setDiscloseValidated(filteredResults);
    console.log("Filtered Results:", filteredResults);
  }, [previewResults]);

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
    <div className="flex flex-column w-full gap-2">
      <div className="flex w-full">
        <SecHeading
          svgIcon={<DiscloseIcon size={"25em"} />}
          heading={"Disclose Compounds"}
          displayHorizon={false}
          color={appColors.molecuLogix.disclose}
        />
      </div>
      <div className="flex justify-content-center w-full">
        <Stepper ref={stepperRef} className="w-full pl-3 pr-3" linear={true}>
          {/* Step 1: Input */}
          <StepperPanel header="Input">
            <div className="flex flex-column">
              <div className="flex justify-content-center align-items-center">
                <MDInput
                  inputs={inputs}
                  setInputs={setInputs}
                  moveToPreview={moveToPreview}
                />
              </div>
              <div className="flex justify-content-end pt-4">
                <Button
                  label="Next"
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  onClick={moveToPreview}
                />
              </div>
            </div>
          </StepperPanel>

          {/* Step 2: Preview */}
          <StepperPanel header="Preview">
            <div className="flex flex-column">
              <div className="flex justify-content-center align-items-center">
                {" "}
                <MDPreview
                  inputs={inputs}
                  setInputs={setInputs}
                  previewResults={previewResults}
                  setPreviewResults={setPreviewResults}
                />
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
                label="Agree & Disclose"
                icon="pi pi-arrow-right"
                iconPos="right"
                disabled={discloseValidated.length === 0}
                onClick={() => stepperRef.current?.nextCallback()}
              />
            </div>
          </StepperPanel>

          {/* Step 3: Result */}
          <StepperPanel header="Result">
            <div className="flex flex-column">
              <div className="flex justify-content-center align-items-center">
                {" "}
                <MDResult
                  discloseValidated={discloseValidated}
                  results={results}
                  setResults={setResults}
                />
              </div>
            </div>
            <div className="flex pt-4 justify-content-start">
              {/* <Button
                label="Back"
                severity="secondary"
                icon="pi pi-arrow-left"
                onClick={() => stepperRef.current?.prevCallback()}
              /> */}
            </div>
          </StepperPanel>
        </Stepper>
      </div>
    </div>
  );
};

export default observer(MDisclose);
