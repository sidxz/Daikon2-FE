import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Fieldset } from "primereact/fieldset";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import React, { useContext, useState } from "react";
import JSMEditor from "../../../Library/JSME/JSMEditor";
import { RootStoreContext } from "../../../RootStore";
import MolDbAPI from "../api/MolDbAPI";
import { MolecuLogixIcon } from "../Icons/MolecuLogixIcon";
import SearchConditions from "../MLogixSearch/SearchContainer/SearchConditions";
import MSelectorResults from "./MSelectorResults";

const MCompoundSelector = ({
  showOptionalFilters = false,
  onCompoundSelect = (selectedCompound) => {
    console.warn("No onCompoundSelect function provided", selectedCompound);
  },
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState("similarity");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showStructureEditor, setShowStructureEditor] = useState(false);
  const [similarityThreshold, setSimilarityThreshold] = useState(90);
  const [searchLimit, setSearchLimit] = useState(100);
  const [conditions, setConditions] = useState([
    { property: null, min: "", max: "" },
  ]);

  const rootStore = useContext(RootStoreContext);

  /* Construct Query String */
  const buildQueryString = (params) => {
    return new URLSearchParams(params).toString();
  };

  /* API Calls */
  const searchForSimilarMolecules = () => {
    setLoading(true);
    const params = {
      smiles: searchValue,
      threshold: similarityThreshold / 100,
      limit: searchLimit,
    };
    conditions.forEach((condition) => {
      if (condition.property) {
        if (condition.min) params[`${condition.property}Min`] = condition.min;
        if (condition.max) params[`${condition.property}Max`] = condition.max;
      }
    });

    const queryString = buildQueryString(params);

    MolDbAPI.findSimilarMolecules(queryString)
      .then((response) => {
        setSearchResults(response);
      })
      .catch((error) =>
        console.error("Error in searchForSimilarMolecules:", error)
      )
      .finally(() => setLoading(false));
  };

  const searchForExact = () => {
    setLoading(true);
    const params = { smiles: searchValue, threshold: 1, limit: 1 };
    const queryString = buildQueryString(params);

    MolDbAPI.findSimilarMolecules(queryString)
      .then((response) => {
        setSearchResults(response);
      })
      .catch((error) => console.error("Error in searchForExact:", error))
      .finally(() => setLoading(false));
  };

  const searchByName = () => {
    setLoading(true);
    const params = { name: searchValue, limit: searchLimit };
    conditions.forEach((condition) => {
      if (condition.property) {
        if (condition.min) params[`${condition.property}Min`] = condition.min;
        if (condition.max) params[`${condition.property}Max`] = condition.max;
      }
    });

    const queryString = buildQueryString(params);

    MolDbAPI.findByName(queryString)
      .then((response) => {
        setSearchResults(response);
      })
      .catch((error) => console.error("Error in searchByName:", error))
      .finally(() => setLoading(false));
  };

  const searchForSubstructure = () => {
    setLoading(true);
    const params = { smiles: searchValue, limit: searchLimit };
    conditions.forEach((condition) => {
      if (condition.property) {
        if (condition.min) params[`${condition.property}Min`] = condition.min;
        if (condition.max) params[`${condition.property}Max`] = condition.max;
      }
    });

    const queryString = buildQueryString(params);

    MolDbAPI.findSubStructures(queryString)
      .then((response) => {
        setSearchResults(response);
      })
      .catch((error) => console.error("Error in searchForSubstructure:", error))
      .finally(() => setLoading(false));
  };

  const searchAPI = () => {
    switch (searchType) {
      case "substructure":
        searchForSubstructure();
        break;
      case "similarity":
        searchForSimilarMolecules();
        break;
      case "exact":
        searchForExact();
        break;
      case "name":
        searchByName();
        break;
      default:
        console.error("Invalid search type");
    }
  };

  return (
    <div className="flex w-full flex-column gap-1">
      {/* Search Input and Buttons */}
      <div className="flex w-full align-items-center gap-2">
        <InputText
          className="w-9 text-lg"
          placeholder="Enter search query: SMILES or Name"
          value={searchValue}
          disabled={loading}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <Button
          text
          icon={<MolecuLogixIcon size={28} />}
          label="Structure Editor"
          onClick={() => setShowStructureEditor(true)}
          disabled={searchType === "name" || loading}
        />
        <Button
          className="p-button-lg"
          label="Search"
          size="large"
          loading={loading}
          disabled={!searchValue}
          onClick={searchAPI}
        />
      </div>
      {/* Radio Buttons */}

      <div className="flex w-full align-items-center gap-4">
        {["substructure", "similarity", "exact", "name"].map((type) => (
          <div key={type} className="flex align-items-center">
            <RadioButton
              inputId={type}
              name="searchType"
              value={type}
              onChange={(e) => setSearchType(e.value)}
              checked={searchType === type}
            />
            <label htmlFor={type} className="ml-2">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </label>
          </div>
        ))}
      </div>
      {/* Filters */}
      {showOptionalFilters && (
        <Fieldset legend="Optional" collapsed={true} toggleable>
          <SearchConditions
            conditions={conditions}
            setConditions={setConditions}
          />
        </Fieldset>
      )}
      {/* Search Results */}
      <div className="flex w-full align-items-center">
        <MSelectorResults
          results={searchResults}
          loading={loading}
          searchType={searchType}
          searchValue={searchValue}
          onCompoundSelect={onCompoundSelect}
        />
      </div>
      {/* Structure Editor Dialog */}
      <Dialog
        visible={showStructureEditor}
        closable={false}
        onHide={() => setShowStructureEditor(false)}
      >
        <JSMEditor
          initialSmiles={searchValue}
          onSave={(s) => {
            setSearchValue(s);
            setShowStructureEditor(false);
          }}
        />
      </Dialog>
    </div>
  );
};

export default observer(MCompoundSelector);
