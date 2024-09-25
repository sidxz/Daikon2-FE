import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Fieldset } from "primereact/fieldset";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import React, { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RootStoreContext } from "../../../../RootStore";
import MolDbAPI from "../../api/MolDbAPI";
import { MolecuLogixIcon } from "../../Icons/MolecuLogixIcon";
import SearchWithConditions from "./SearchWithConditions";

const SearchBar = ({}) => {
  const navigate = useNavigate();
  const params = useParams();
  const [searchValue, setSearchValue] = useState(params.smiles ?? "");
  const [searchType, setSearchType] = useState("similarity");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [showStructureEditor, setShowStructureEditor] = useState(false);
  const [similarityThreshold, setSimilarityThreshold] = useState(90);
  const [searchLimit, setSearchLimit] = useState(100);
  const [conditions, setConditions] = useState([
    { property: null, min: "", max: "" },
  ]);

  const rootStore = useContext(RootStoreContext);

  const conditionsQueryGenerator = (params) => {
    conditions.forEach((condition) => {
      if (condition.property) {
        if (
          condition.min !== "" &&
          condition.min !== null &&
          condition.min !== undefined
        ) {
          params[`${condition.property}Min`] = condition.min;
        }
        if (
          condition.max !== "" &&
          condition.max !== null &&
          condition.max !== undefined
        ) {
          params[`${condition.property}Max`] = condition.max;
        }
      }
    });
  };

  const searchForSimilarMolecules = () => {
    setLoading(true);

    // Construct the base URL with the similarity parameters

    const params = {
      smiles: searchValue,
      threshold: similarityThreshold / 100,
      limit: searchLimit,
    };

    // Add additional filter conditions (min/max for selected properties)
    conditionsQueryGenerator(params);

    // Convert params to a query string
    const queryString = new URLSearchParams(params).toString();

    console.log(queryString);

    MolDbAPI.findSimilarMolecules(queryString)
      .then((response) => {
        setSearchResults(response);
        console.log(response);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const searchAPI = () => {
    switch (searchType) {
      case "substructure":
        console.log("Substructure search");
        break;
      case "similarity":
        console.log("Similarity search");
        return searchForSimilarMolecules();
        break;
      case "exact":
        console.log("Exact search");
        break;
      case "name":
        console.log("Name search");
        break;
      default:
        console.log("Invalid search type");
    }
  };

  return (
    <div className="flex w-full flex-column gap-1 p-3">
      {/* Search Input and Buttons */}
      <div className="flex w-full align-items-center gap-3">
        <div className="flex-grow-1">
          <InputText
            className="w-full text-lg"
            placeholder="Enter search query"
            autoFocus
            value={searchValue}
            disabled={loading}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <div className="flex">
          <Button
            text
            type="button"
            icon={<MolecuLogixIcon size={28} />}
            label="Launch Structure Editor"
            disabled={loading}
            //onClick={() => setShowStructureEditor(true)}
          />
        </div>
        <div>
          <Button
            className="p-button-lg"
            label="Search"
            size="large"
            loading={loading}
            disabled={searchValue === ""}
            onClick={() => searchAPI()}
          />
        </div>
      </div>

      {/* Radio Buttons */}
      <div className="flex w-full border-1 border-50 border-round-md p-3 align-items-center">
        <div className="flex-grow-1 flex gap-4">
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
        <div className="flex align-items-center gap-2">
          <label className="text-color-secondary text-sm">Limit Results</label>
          <InputText
            className="text-sm w-4rem p-1"
            keyfilter="int"
            value={searchLimit}
            onChange={(e) => setSearchLimit(e.target.value)}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex w-full align-items-center">
        <Fieldset
          className="w-full flex-grow-1"
          legend={
            <label className="text-color-secondary text-sm">Optional</label>
          }
        >
          <SearchWithConditions
            conditions={conditions}
            setConditions={setConditions}
          />
        </Fieldset>
      </div>
    </div>
  );
};

export default observer(SearchBar);
