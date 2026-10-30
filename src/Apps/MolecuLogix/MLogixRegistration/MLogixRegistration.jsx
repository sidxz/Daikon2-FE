import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { appColors } from "../../../constants/colors";
import { STRINGS } from "../../../Customizations/strings";
import SecHeading from "../../../Library/SecHeading/SecHeading";
import { parseSeedParam } from "../../../Library/URLTools/base64URL";
import MolDbAPI from "../api/MolDbAPI";
import MLRegistrationStep1 from "./components/MLRegistrationStep1";
import MLRegistrationStep2 from "./components/MLRegistrationStep2";
import MLRegistrationStep3 from "./components/MLRegistrationStep3";

const toRows = (response) => {
  const rows = response?.results ?? response?.items ?? response ?? [];
  return Array.isArray(rows) ? rows : [rows];
};

const MLogixRegistration = () => {
  const location = useLocation();

  const initialRowsFromUrl = useMemo(() => {
    const qs = new URLSearchParams(location.search);
    const seed = qs.get("seed");
    if (!seed) return [];

    try {
      const obj = parseSeedParam(seed);

      // Support either a single row object or { rows: [...] }
      if (Array.isArray(obj)) return obj;
      if (Array.isArray(obj?.rows)) return obj.rows;
      return [obj];
    } catch (e) {
      console.warn("Invalid seed param", e);
      return [];
    }
  }, [location.search]);

  // Lifted state
  const [inputs, setInputs] = useState([]); // rows from MRInputSource
  const [previewResults, setPreviewResults] = useState([]);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [registrationResults, setRegistrationResults] = useState([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const previewRun = useRef(0);

  // Both requests run from the button clicks, not from the steps' mount effects:
  // StrictMode mounts components twice in dev, which sent the registration (a write) twice.
  const runPreview = async () => {
    const run = ++previewRun.current; // a newer preview (Back, edit, re-run) wins
    setIsPreviewing(true);
    setPreviewResults([]);
    try {
      const response = await MolDbAPI.registerMoleculePreview(inputs);
      if (run === previewRun.current) setPreviewResults(toRows(response));
    } catch (err) {
      console.error("Error during dry run request:", err);
    } finally {
      if (run === previewRun.current) setIsPreviewing(false);
    }
  };

  const register = async () => {
    setIsRegistering(true);
    setRegistrationResults([]);
    try {
      setRegistrationResults(
        toRows(await MolDbAPI.registerMoleculeBatch(inputs)),
      );
    } catch (err) {
      console.error("Error during registration request:", err);
    } finally {
      setIsRegistering(false);
    }
  };

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
        {/* linear: steps only advance through the buttons, which send the requests */}
        <Stepper
          ref={stepperRef}
          linear
          className="w-full"
          style={{ minWidth: "60vw" }}
        >
          <StepperPanel header="Input Source">
            <div className="flex flex-column">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-row flex justify-content-center align-items-center font-medium">
                <MLRegistrationStep1
                  onDataReady={setInputs}
                  initialRows={initialRowsFromUrl}
                  autoApplyInitialRows
                />
              </div>
            </div>
            <div className="flex pt-2 justify-content-end">
              <Button
                label="Dry Run Validation"
                icon="pi pi-arrow-right"
                iconPos="right"
                onClick={() => {
                  runPreview();
                  stepperRef.current.nextCallback();
                }}
                disabled={!canProceedToValidation}
              />
            </div>
          </StepperPanel>

          {/* STEP 2: Validation Preview */}
          <StepperPanel header="Dry Run Validation">
            <div className="flex flex-column">
              <div className="border-2 border-dashed surface-border border-round surface-ground p-2">
                <MLRegistrationStep2
                  inputs={inputs}
                  results={previewResults}
                  loading={isPreviewing}
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
                label="Acknowledge Disclosure and Register Molecules"
                icon="pi pi-arrow-right"
                iconPos="right"
                onClick={() => {
                  register();
                  stepperRef.current.nextCallback();
                }}
                disabled={isRegistering}
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
                <MLRegistrationStep3
                  inputs={inputs}
                  results={registrationResults}
                  loading={isRegistering}
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
            </div>
          </StepperPanel>
        </Stepper>
      </div>
    </div>
  );
};

export default observer(MLogixRegistration);
