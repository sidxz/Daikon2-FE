import { upperFirst } from "lodash";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Fieldset } from "primereact/fieldset";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import React from "react";

const TPSelector = ({
  selectedGenes,
  setSelectedGenes,
  setProteinName,
  geneList,
  proteinName,
  nextStep,
}) => {
  const onGenesSelected = (e) => {
    console.log("selected genes", e);
    setSelectedGenes(e.value);
    proteinNameSuggestion(e.value);
  };

  const proteinNameSuggestion = (genes) => {
    const selectedGeneNames = genes.map((gene) => upperFirst(gene.name));
    let suggestedProteinName = selectedGeneNames.join("-");
    setProteinName(suggestedProteinName);
  };

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
              onChange={(e) => onGenesSelected(e)}
              options={geneList}
              optionLabel={(option) =>
                option.accessionNumber + " ( " + option.name + " )"
              }
              placeholder="Select Genes"
              maxSelectedLabels={30}
              filter
              className="w-full"
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

        <div className="flex gap-4  w-full">
          <div className="flex border-1 border-50 p-2 w-4 text-lg">
            Protein Name
          </div>
          <div className="flex flex-column w-6">
            <InputText
              id="proteinName"
              type="text"
              className="w-full"
              placeholder="Enter Protein Name"
              value={proteinName}
            />
            {proteinName && (
              <p className="text-xs text-gray-500">
                A name suggestion has been generated following the established
                naming conventions for proteins.
              </p>
            )}
          </div>
        </div>
        <div className="flex align-items-center w-11 p-2 justify-content-end">
          <Button
            label="Start Target Promotion Questionnaire"
            onClick={() => nextStep()}
          />
        </div>
      </Fieldset>
    </div>
  );
};

export default observer(TPSelector);
