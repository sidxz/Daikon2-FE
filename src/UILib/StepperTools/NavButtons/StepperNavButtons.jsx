import { Button } from "primereact/button";
import React from "react";

const StepperNavButtons = ({
  stepperRef,
  showBack = true,
  showNext = true,

  nextDisabled = false,
  showSubmit = false,
  submitDisabled = false,
  nextFunc = () => {},
  prevFunc = () => {},
  submitFunc = () => {},
  nextLabel = "Next",
  backLabel = "Back",
  submitLabel = "Submit",

  submitLoading = false,
}) => {
  if (stepperRef.current === null) {
    console.error("StepperNavButtons: stepperRef.current is null");
    return <></>;
  }

  return (
    <div className="flex justify-content-end flex-wrap w-full gap-2">
      {showBack && (
        <Button
          className="p-button-outlined"
          label={backLabel}
          severity="secondary"
          icon="pi pi-arrow-left"
          onClick={() => {
            stepperRef.current.prevCallback?.();
            prevFunc?.();
          }}
        />
      )}
      {showNext && (
        <Button
          className="p-button-outlined"
          label={nextLabel}
          icon="pi pi-arrow-right"
          iconPos="right"
          onClick={() => {
            stepperRef.current.nextCallback?.();
            nextFunc?.();
          }}
          disabled={nextDisabled}
        />
      )}
      {showSubmit && (
        <Button
          className="p-button-outlined"
          label={submitLabel}
          icon="pi pi-arrow-right"
          iconPos="right"
          onClick={() => {
            submitFunc?.();
          }}
          disabled={submitDisabled}
          loading={submitLoading}
        />
      )}
    </div>
  );
};

export default StepperNavButtons;
