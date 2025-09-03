import { Button } from "primereact/button";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { useRef } from "react";
import { appColors } from "../../../constants/colors";
import { STRINGS } from "../../../Customizations/strings";
import SecHeading from "../../../Library/SecHeading/SecHeading";
import MRInputSource from "./MRInputSource/MRInputSource";

const MRegister = () => {
  const stepperRef = useRef(null);
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
          <StepperPanel header="Input Source">
            <div className="flex flex-column">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-row flex justify-content-center align-items-center font-medium">
                <MRInputSource />
              </div>
            </div>
            <div className="flex pt-4 justify-content-end">
              <Button
                label="Next"
                icon="pi pi-arrow-right"
                iconPos="right"
                onClick={() => stepperRef.current.nextCallback()}
              />
            </div>
          </StepperPanel>
          <StepperPanel header="Data Validation">
            <div className="flex flex-column h-12rem">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                Content II
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
              />
            </div>
          </StepperPanel>
          <StepperPanel header="Import">
            <div className="flex flex-column h-12rem">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                Content III
              </div>
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

export default MRegister;
