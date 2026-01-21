import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { useMemo, useRef, useState } from "react";
import { appColors } from "../../../constants/colors";
import { STRINGS } from "../../../Customizations/strings";
import SecHeading from "../../../Library/SecHeading/SecHeading";
import MLRegistrationsStep3 from "./components/MLRegistrationsStep3";
import MLRegistrationStep1 from "./components/MLRegistrationStep1";
import MLRegistrationStep2 from "./components/MLRegistrationStep2";

const MLogixRegistration = () => {
  // Lifted state
  const [inputs, setInputs] = useState([]); // rows from MRInputSource
  const [previewResults, setPreviewResults] = useState([]);

  const canProceedToValidation = (inputs?.length || 0) > 0;
  const okCount = useMemo(
    () => (previewResults || []).filter((r) => r?.isValid).length,
    [previewResults],
  );
  const canProceedToImport = okCount > 0;
  const stepperRef = useRef(null);
  return (
    <div className="flex flex-column w-full gap-1 fadein animation-duration-1000">
      <div className="flex w-full">
        <SecHeading
          heading={"Molecule Registration System"}
          displayHorizon={false}
          color={appColors.molecuLogix.disclose}
        />
      </div>

      <div className="flex flex-column">
        <Message severity="warn" text={STRINGS.DISCLOSURE_NOTICE} closable />
      </div>

      <div className="flex justify-content-center w-full">
        <Stepper
          ref={stepperRef}
          className="w-full"
          style={{ minWidth: "60vw" }}
        >
          <StepperPanel header="Input Source">
            <div className="flex flex-column">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-row flex justify-content-center align-items-center font-medium">
                <MLRegistrationStep1 onDataReady={setInputs} />
              </div>
            </div>
            <div className="flex pt-2 justify-content-end">
              <Button
                label="Dry Run Validation"
                icon="pi pi-arrow-right"
                iconPos="right"
                onClick={() => stepperRef.current.nextCallback()}
                disabled={!canProceedToValidation}
              />
            </div>
          </StepperPanel>

          {/* STEP 2: Validation Preview */}
          <StepperPanel header="Dry Run Validation">
            <div className="flex flex-column">
              <div className="border-2 border-dashed surface-border border-round surface-ground p-2">
                <MLRegistrationStep2 inputs={inputs} />
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
                label="Acknowledge Disclosure and Register Molecules"
                icon="pi pi-arrow-right"
                iconPos="right"
                onClick={() => stepperRef.current.nextCallback()}
                // disabled={!canProceedToImport}
                // tooltip={
                //   !canProceedToImport
                //     ? "You need at least one OK row to proceed"
                //     : undefined
                //}
              />
            </div>
          </StepperPanel>

          {/* STEP 3: Results */}

          <StepperPanel header="Registrations">
            <div className="flex flex-column">
              <div className="border-2 border-dashed surface-border border-round surface-ground p-2">
                <MLRegistrationsStep3 inputs={inputs} />
              </div>
            </div>
            <div className="flex pt-4 justify-content-between">
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

export default observer(MLogixRegistration);
