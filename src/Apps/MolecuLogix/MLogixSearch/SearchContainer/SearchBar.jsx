import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Fieldset } from "primereact/fieldset";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"; // useSearchParams instead of useParams
import JSMEditor from "../../../../Library/JSME/JSMEditor";
import { RootStoreContext } from "../../../../RootStore";
import MolDbAPI from "../../api/MolDbAPI";
import { MolecuLogixIcon } from "../../Icons/MolecuLogixIcon";
import SearchResults from "../SearchResults/SearchResults";
import { extractConditionsFromUrl } from "./helper";
import SearchConditions from "./SearchConditions";

const SearchBar = ({}) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("smiles") || ""
  );
  const [searchType, setSearchType] = useState(
    searchParams.get("searchType") || "substructure"
  );
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showStructureEditor, setShowStructureEditor] = useState(false);
  const [similarityThreshold, setSimilarityThreshold] = useState(
    Number(searchParams.get("threshold") || 90)
  );
  const [searchLimit, setSearchLimit] = useState(
    Number(searchParams.get("limit") || 100)
  );
  const [conditions, setConditions] = useState([
    { property: null, min: "", max: "" },
  ]);

  const rootStore = useContext(RootStoreContext);

  // Function to sync state with URL
  const syncUrlWithParams = () => {
    const params = {
      smiles: searchValue,
      threshold: similarityThreshold,
      limit: searchLimit,
      searchType,
      conditions,
    };

    conditions.forEach((condition) => {
      if (condition.property) {
        if (condition.min) {
          params[`${condition.property}Min`] = condition.min;
        }
        if (condition.max) {
          params[`${condition.property}Max`] = condition.max;
        }
      }
    });

    setSearchParams(params); // Update the URL query string
  };

  // On component mount, initialize conditions from URL params
  useEffect(() => {
    const initialConditions = extractConditionsFromUrl(searchParams);
    setConditions(initialConditions);
  }, []);

  useEffect(() => {
    // Sync URL with params whenever any search parameter changes
    syncUrlWithParams();
  }, [searchValue, searchType, similarityThreshold, searchLimit, conditions]);

  /* Prepare Similar Molecule Search */
  const searchForSimilarMolecules = () => {
    setLoading(true);

    const params = {
      smiles: searchValue,
      threshold: similarityThreshold / 100,
      limit: searchLimit,
    };

    conditions.forEach((condition) => {
      if (condition.property) {
        if (condition.min) {
          params[`${condition.property}Min`] = condition.min;
        }
        if (condition.max) {
          params[`${condition.property}Max`] = condition.max;
        }
      }
    });

    const queryString = new URLSearchParams(params).toString();

    MolDbAPI.findSimilarMolecules(queryString)
      .then((response) => {
        console.log(response);
        setSearchResults(response);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  /* Prepare Exact Molecule Search */
  const searchForExact = () => {
    setLoading(true);

    const params = {
      smiles: searchValue,
      threshold: 1,
      limit: 1,
    };

    const queryString = new URLSearchParams(params).toString();

    MolDbAPI.findSimilarMolecules(queryString)
      .then((response) => {
        console.log(response);
        setSearchResults(response);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  /* Prepare By Name Molecule Search */
  const searchByName = () => {
    setLoading(true);

    const params = {
      name: searchValue,
      limit: searchLimit,
    };

    const queryString = new URLSearchParams(params).toString();

    MolDbAPI.findByName(queryString)
      .then((response) => {
        console.log(response);
        setSearchResults(response);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const searchForSubstructure = () => {
    setLoading(true);

    const params = {
      smiles: searchValue,
      limit: searchLimit,
    };

    conditions.forEach((condition) => {
      if (condition.property) {
        if (condition.min) {
          params[`${condition.property}Min`] = condition.min;
        }
        if (condition.max) {
          params[`${condition.property}Max`] = condition.max;
        }
      }
    });

    const queryString = new URLSearchParams(params).toString();

    MolDbAPI.findSubStructures(queryString)
      .then((response) => {
        console.log(response);
        setSearchResults(response);
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
        return searchForSubstructure();
      case "similarity":
        return searchForSimilarMolecules();
      case "exact":
        return searchForExact();
      case "name":
        return searchByName();
      default:
        console.log("Invalid search type");
    }
  };

  console.log("searchResults", searchResults);

  return (
    <>
      <div className="flex w-full flex-column gap-1 p-3">
        {/* Search Input and Buttons */}
        <div className="flex w-full align-items-center gap-3">
          <div className="flex-grow-1">
            <InputText
              className="w-full text-lg"
              placeholder="Enter search query: SMILES or Name"
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
              onClick={() => setShowStructureEditor(true)}
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
                onChange={(e) => setSearchType(e.value) && setSearchResults([])}
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
                onChange={(e) => setSearchType(e.value) && setSearchResults([])}
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
                onChange={(e) => setSearchType(e.value) && setSearchResults([])}
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
                onChange={(e) => setSearchType(e.value) && setSearchResults([])}
                checked={searchType === "name"}
              />
              <label htmlFor="name" className="ml-2">
                By Name
              </label>
            </div>
          </div>
          <div className="flex align-items-center gap-2">
            <label className="text-color-secondary text-sm">
              Limit Results
            </label>
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
            <SearchConditions
              conditions={conditions}
              setConditions={setConditions}
            />
          </Fieldset>
        </div>

        <div className="flex w-full align-items-center">
          <SearchResults
            results={searchResults}
            loading={loading}
            searchType={searchType}
            searchValue={searchValue}
          />
        </div>
      </div>
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
              setSearchValue(s);
            }}
          />
        </div>
      </Dialog>
    </>
  );
};

export default observer(SearchBar);
