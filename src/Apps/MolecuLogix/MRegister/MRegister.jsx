// MRegister.jsx
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { useMemo, useRef, useState } from "react";
import { appColors } from "../../../constants/colors";
import { STRINGS } from "../../../Customizations/strings";
import SecHeading from "../../../Library/SecHeading/SecHeading";
import MRImport from "./MRImport/MRImport"; // ⬅️ add this
import MRInputSource from "./MRInputSource/MRInputSource";
import MRPreview from "./MRPreview/MRPreview";

const MRegister = () => {
  const stepperRef = useRef(null);

  // Lifted state
  const [inputs, setInputs] = useState([]); // rows from MRInputSource
  const [previewResults, setPreviewResults] = useState([]);

  const canProceedToValidation = (inputs?.length || 0) > 0;
  const okCount = useMemo(
    () => (previewResults || []).filter((r) => r?.isValid).length,
    [previewResults]
  );
  const canProceedToImport = okCount > 0;

  return (
    <div className="flex flex-column w-full gap-2 fadein animation-duration-1000">
      <div className="flex w-full">
        <SecHeading
          heading={"Register Compounds"}
          displayHorizon={false}
          color={appColors.molecuLogix.disclose}
        />
      </div>

      <div className="flex flex-column w-full gap-1 p-2">
        <div className="flex w-full">
          <p className="text-md p-0 m-0">DISCLOSURE NOTICE</p>
        </div>
        <div className="flex w-full font-bold">{STRINGS.DISCLOSURE_NOTICE}</div>
      </div>

      <div className="flex justify-content-center w-full">
        <Stepper
          ref={stepperRef}
          className="w-full"
          style={{ minWidth: "60vw" }}
        >
          {/* STEP 1: Input */}
          <StepperPanel header="Input Source">
            <div className="flex flex-column">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-row flex justify-content-center align-items-center font-medium">
                <MRInputSource onDataReady={setInputs} />
              </div>
            </div>
            <div className="flex pb-1 justify-content-end">
              <Button
                label="Next"
                icon="pi pi-arrow-right"
                iconPos="right"
                onClick={() => stepperRef.current.nextCallback()}
                disabled={!canProceedToValidation}
              />
            </div>
          </StepperPanel>

          {/* STEP 2: Validation Preview */}
          <StepperPanel header="Data Validation">
            <div className="flex flex-column">
              <div className="border-2 border-dashed surface-border border-round surface-ground p-2">
                <MRPreview
                  inputs={inputs}
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
                onClick={() => stepperRef.current.prevCallback()}
              />
              <Button
                label="Next"
                icon="pi pi-arrow-right"
                iconPos="right"
                onClick={() => stepperRef.current.nextCallback()}
                disabled={!canProceedToImport}
                tooltip={
                  !canProceedToImport
                    ? "You need at least one OK row to proceed"
                    : undefined
                }
              />
            </div>
          </StepperPanel>

          {/* STEP 3: Import */}
          <StepperPanel header="Import">
            <div className="border-2 border-dashed surface-border border-round surface-ground p-3">
              {/* MRImport grabs the OK rows by name and maps back to full inputs */}
              <MRImport inputs={inputs} previewResults={previewResults} />
            </div>
            <div className="flex pt-4 justify-content-start">
              <Button
                label="Back"
                severity="secondary"
                icon="pi pi-arrow-left"
                onClick={() => stepperRef.current.prevCallback()}
              />
            </div>
          </StepperPanel>
        </Stepper>
      </div>
    </div>
  );
};

export default observer(MRegister);
