import { observer } from "mobx-react-lite";
import { DataView } from "primereact/dataview";
import React from "react";
import PleaseWait from "../../../../Library/PleaseWait/PleaseWait";
import SearchResultCard from "./SearchResultCard";
const SearchResults = ({
  results,
  loading = true,
  searchType,
  searchValue,
}) => {
  const searchItemTemplate = (molecule, index) => {
    return (
      <SearchResultCard
        molecule={molecule}
        searchType={searchType}
        searchValue={searchValue}
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
        <DataView
          className="fadein animation-duration-500"
          value={results}
          listTemplate={searchListTemplate}
        />
      )}
    </div>
  );
};

export default observer(SearchResults);
