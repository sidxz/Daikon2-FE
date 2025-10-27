import { upperFirst } from "lodash";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Fieldset } from "primereact/fieldset";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { RootStoreContext } from "../../../../../../RootStore";

/**
 * TPSelector
 * - Select genes to promote and pick a unique protein name
 *
 * Props:
 *  - selectedGenes: array
 *  - setSelectedGenes: fn
 *  - setProteinName: fn
 *  - geneList: array of { accessionNumber, name, ... }
 *  - proteinName: string (optional initial)
 *  - nextStep: fn
 */
const TPSelector = ({
  selectedGenes,
  setSelectedGenes,
  setProteinName,
  geneList,
  proteinName,
  nextStep,
}) => {
  const rootStore = useContext(RootStoreContext);
  const {
    targetList = [],
    isFetchingTargets,
    isTargetListCacheValid,
    fetchTargets,
  } = rootStore.targetStore;

  const { isFetchingGenes } = rootStore.geneStore;

  // initialize with incoming proteinName if provided
  const [tempProteinName, setTempProteinName] = useState(proteinName ?? "");

  // If this component is rendered outside the dashboard, make sure targets are loaded once.
  const didRequestRef = useRef(false);
  useEffect(() => {
    if (
      !isTargetListCacheValid &&
      !isFetchingTargets &&
      !didRequestRef.current
    ) {
      didRequestRef.current = true; // StrictMode / double-mount guard
      void fetchTargets();
    }
  }, [isTargetListCacheValid, isFetchingTargets, fetchTargets]);

  const normalize = (s) => (s ?? "").trim().toLowerCase();

  // is the entered name already taken by an existing target?
  const isNameTaken = useMemo(() => {
    if (!tempProteinName) return false;
    const n = normalize(tempProteinName);
    return targetList.some((t) => normalize(t.name) === n);
  }, [tempProteinName, targetList]);

  const onGenesSelected = (e) => {
    const genes = e.value || [];
    setSelectedGenes(genes);
    proteinNameSuggestion(genes);
  };

  const proteinNameSuggestion = (genes) => {
    const selectedGeneNames = (genes || []).map((gene) =>
      upperFirst(gene.name)
    );
    const suggested = selectedGeneNames.join("-");
    setTempProteinName(suggested);
    setProteinName(suggested);
  };

  const onNameChange = (e) => {
    const v = e.target.value;
    setTempProteinName(v);
    setProteinName(v);
  };

  // IMPORTANT: do NOT block on "targetList.length === 0".
  // If there are zero targets but the cache is valid, we should still allow availability checks.
  const isCheckingAvailability = isFetchingTargets || !isTargetListCacheValid;

  const canProceed =
    selectedGenes.length > 0 &&
    !!tempProteinName.trim() &&
    !isNameTaken &&
    !isCheckingAvailability;

  return (
    <div className="flex w-full">
      <Fieldset className="w-full mt-1" legend="Gene Selection and Naming">
        <div className="flex gap-4 align-items-center w-full p-2 text-sm">
          A target promotion refers to the process of identifying and validating
          a specific biological target as a potential therapeutic opportunity.
        </div>
        <Divider />
        <div className="flex gap-4 align-items-center w-full">
          <div className="flex border-1 border-50 p-2 w-4">
            Select the genes you want to promote
          </div>
          <div className="flex w-6">
            <MultiSelect
              value={selectedGenes}
              onChange={onGenesSelected}
              options={geneList}
              optionLabel={(option) =>
                `${option.accessionNumber} ( ${option.name} )`
              }
              virtualScrollerOptions={{ itemSize: 43 }}
              placeholder="Select Genes"
              maxSelectedLabels={30}
              filter
              className="w-full"
              loading={isFetchingGenes || isFetchingTargets}
            />
          </div>
        </div>

        <Divider />

        <div className="flex gap-4 align-items-center w-9 p-2 text-sm">
          <h4>Nomenclature</h4>
          <p>
            Consistent protein nomenclature is indispensable for communication,
            literature searching and entry retrieval. A good protein name is one
            which is unique, unambiguous, can be attributed to orthologs from
            other species and follows official gene nomenclature where
            applicable. Please adhere to the{" "}
            <a
              href="https://www.ncbi.nlm.nih.gov/genome/doc/internatprot_nomenguide"
              target="_blank"
              rel="noreferrer"
            >
              International Protein Nomenclature Guidelines.
            </a>
          </p>
        </div>

        <div className="flex gap-4 w-full">
          <div className="flex border-1 border-50 p-2 w-4 text-lg">
            Protein Name
          </div>
          <div className="flex flex-column w-6">
            <InputText
              id="proteinName"
              type="text"
              className="w-full"
              placeholder="Enter Protein Name"
              value={tempProteinName}
              onChange={onNameChange}
            />

            {tempProteinName ? (
              <div className="flex flex-column mt-2">
                <p className="text-xs text-gray-500">
                  A name suggestion has been generated following the established
                  naming conventions for proteins.
                </p>

                {isCheckingAvailability ? (
                  <p className="text-xs text-gray-500">
                    Checking availability…
                  </p>
                ) : (
                  <p
                    className={isNameTaken ? "text-red-500" : "text-green-500"}
                  >
                    The name{" "}
                    <span className="font-medium">{tempProteinName}</span> is{" "}
                    {isNameTaken ? "not available" : "available"}.
                    {isNameTaken &&
                      " A target with the same name already exists."}
                  </p>
                )}
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex align-items-center w-11 p-2 justify-content-end">
          <Button
            label="Start Target Promotion Questionnaire"
            onClick={nextStep}
            disabled={!canProceed}
          />
        </div>
      </Fieldset>
    </div>
  );
};

export default observer(TPSelector);
