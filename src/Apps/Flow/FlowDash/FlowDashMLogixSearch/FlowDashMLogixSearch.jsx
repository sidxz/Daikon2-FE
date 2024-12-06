import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import JSMEditor from "../../../../Library/JSME/JSMEditor";
import { MolecuLogixIcon } from "../../../MolecuLogix/Icons/MolecuLogixIcon";

const FlowDashMLogixSearch = () => {
  const [searchValue, setSearchValue] = useState(""); // Search value (SMILES or Name)
  const [searchType, setSearchType] = useState("substructure"); // Search type (substructure, similarity, exact, name)
  const [similarityThreshold, setSimilarityThreshold] = useState(90); // Similarity threshold (only used for similarity search)
  const [searchLimit, setSearchLimit] = useState(100); // Search limit
  const [showStructureEditor, setShowStructureEditor] = useState(false); // Structure editor dialog visibility
  const navigate = useNavigate(); // Navigation hook from react-router-dom

  // Function to handle the search button click
  const handleSearch = () => {
    const params = {
      smiles: searchValue,
      searchType: searchType,
      limit: searchLimit,
    };

    // Add similarity threshold only if the search type is similarity
    if (searchType === "similarity") {
      params.threshold = similarityThreshold;
    }

    // Construct query string from params
    const queryParams = new URLSearchParams(params).toString();

    // Navigate to the search results page with the query params
    navigate(`/moleculogix/search/?${queryParams}`);
  };

  return (
    <>
      <div className="flex w-full flex-column gap-1 pl-1 pr-1">
        {/* Search Input and Buttons */}
        <div className="flex flex-column w-full align-items-center gap-3 pl-1 pr-1">
          <div className="flex-grow-1 w-full">
            <InputText
              className="w-full text-lg"
              placeholder="Enter search query: SMILES or Name"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          <div className="flex w-full justify-content-end align-items-center gap-4 mb-1">
            <div className="flex ">
              <Button
                text
                type="p-button"
                icon={<MolecuLogixIcon size={35} />}
                label="Structure Editor"
                onClick={() => setShowStructureEditor(true)}
              />
            </div>
            <div>
              <Button
                className="p-button"
                label="Search"
                size="medium"
                disabled={searchValue === ""}
                onClick={handleSearch} // Trigger the handleSearch function on click
              />
            </div>
            <div className="flex align-items-center gap-2 pr-1">
              <label className="text-color-secondary text-sm">Limit </label>
              <InputText
                className="text-sm w-4rem p-1"
                keyfilter="int"
                value={searchLimit}
                onChange={(e) => setSearchLimit(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Radio Buttons for Search Type */}
        <div className="flex w-full surface-0  border-1 border-50 border-round-md p-3 mb-1 align-items-center">
          <div className="flex-grow-1 flex-column flex gap-4">
            <div className="flex align-items-center">
              <RadioButton
                inputId="substructure"
                name="searchType"
                value="substructure"
                onChange={(e) => setSearchType(e.value)}
                checked={searchType === "substructure"}
              />
              <label htmlFor="substructure" className="ml-2">
                Substructure
              </label>
            </div>
            <div className="flex align-items-center">
              <RadioButton
                inputId="similarity"
                name="searchType"
                value="similarity"
                onChange={(e) => setSearchType(e.value)}
                checked={searchType === "similarity"}
              />
              <label htmlFor="similarity" className="ml-2">
                Similarity
              </label>
            </div>
            <div className="flex align-items-center">
              <RadioButton
                inputId="exact"
                name="searchType"
                value="exact"
                onChange={(e) => setSearchType(e.value)}
                checked={searchType === "exact"}
              />
              <label htmlFor="exact" className="ml-2">
                Exact
              </label>
            </div>
            <div className="flex align-items-center">
              <RadioButton
                inputId="name"
                name="searchType"
                value="name"
                onChange={(e) => setSearchType(e.value)}
                checked={searchType === "name"}
              />
              <label htmlFor="name" className="ml-2">
                By Name
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Structure Editor Dialog */}
      <Dialog
        visible={showStructureEditor}
        closable={false}
        modal={false}
        showHeader={false}
        onHide={() => setShowStructureEditor(false)}
      >
        <div className="flex pt-5">
          <JSMEditor
            initialSmiles={searchValue}
            onSave={(s) => {
              setShowStructureEditor(false);
              setSearchValue(s); // Set the SMILES from the structure editor
            }}
          />
        </div>
      </Dialog>
    </>
  );
};

export default observer(FlowDashMLogixSearch);
