import { observer } from "mobx-react-lite";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import SmilesView from "../../../../Library/SmilesView/SmilesView";

const SearchResultCard = ({ molecule, searchType, searchValue }) => {
  const navigate = useNavigate();

  let navUrl = () => {
    switch (searchType) {
      case "substructure":
        return `/moleculogix/molecule/${molecule.id}?substructure=${searchValue}`;
      default:
        return `/moleculogix/molecule/${molecule.id}`;
    }
  };

  return (
    <div
      className="flex gap-2 border-1 border-50 p-2 m-1 w-25rem	"
      id={molecule.id}
      key={molecule.id}
    >
      <div className="flex border-1 border-50">
        <SmilesView
          smiles={molecule.smilesCanonical}
          subStructure={searchType === "substructure" ? searchValue : null}
          width={150}
          height={150}
        />
      </div>
      <div className="flex flex-column gap-1">
        <div className="flex">
          <NavLink to={navUrl()}>
            <p className="text-2xl m-0">{molecule.name}</p>
          </NavLink>
        </div>
        {searchType === "similarity" && (
          <div className="flex">
            <p className="text-xl m-0">
              Similarity : {(molecule.similarity * 100).toFixed(0)} %
            </p>
          </div>
        )}

        <div className="flex">
          <p className="text-lg m-0 text-color-secondary">
            Mol Weight : {molecule.molecularWeight.toFixed(2)}
          </p>
        </div>
        <div className="flex">
          <p className="text-lg m-0 text-color-secondary">
            TPSA : {molecule.tpsa.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default observer(SearchResultCard);
