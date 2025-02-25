import { observer } from "mobx-react-lite";
import { DataView } from "primereact/dataview";
import React from "react";
import PleaseWait from "../../../Library/PleaseWait/PleaseWait";
import MSelectorCard from "./MSelectorCard";
const MSelectorResults = ({
  results,
  loading = true,
  searchType,
  searchValue,
  onCompoundSelect,
}) => {
  const searchItemTemplate = (molecule, index) => {
    return (
      <MSelectorCard
        molecule={molecule}
        searchType={searchType}
        searchValue={searchValue}
        onCompoundSelect={onCompoundSelect}
      />
    );
  };

  const searchListTemplate = (items) => {
    if (!items || items.length === 0) return null;

    let list = items.map((molecule, index) => {
      return searchItemTemplate(molecule, index);
    });

    return <div className="flex flex-wrap w-full">{list}</div>;
  };

  return (
    <div className="card w-full mt-2 fadein animation-duration-500">
      {loading ? (
        <PleaseWait height="50px" />
      ) : (
        <div className="flex flex-column w-full">
          {results.length != 0 && (
            <div className="flex w-full">
              <p className="text-lg">Click to select compound</p>
            </div>
          )}

          <DataView
            className="fadein animation-duration-500"
            value={results}
            listTemplate={searchListTemplate}
          />
        </div>
      )}
    </div>
  );
};

export default observer(MSelectorResults);
