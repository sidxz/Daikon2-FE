import React from "react";
import { NavLink } from "react-router-dom";
import SmilesView from "../../../../Library/SmilesView/SmilesView";

const MLSimilarSearchCard = ({ molecule, navigate }) => {
  return (
    <div
      className="flex w-full gap-2 border-1 border-50 p-2 m-1"
      id={molecule.id}
      key={molecule.id}
    >
      <div className="flex border-1 border-50">
        <SmilesView
          smiles={molecule.smilesCanonical}
          width={150}
          height={150}
        />
      </div>
      <div className="flex flex-column gap-1">
        <div className="flex">
          <NavLink to={`/moleculogix/molecule/${molecule.id}`}>
            <p className="text-2xl m-0">{molecule.name}</p>
          </NavLink>
        </div>
        <div className="flex">
          <p className="text-xl m-0">
            Similarity : {molecule.similarity * 100} %
          </p>
        </div>
        <div className="flex">
          <p className="text-lg m-0 text-color-secondary">
            {molecule.smilesCanonical}
          </p>
        </div>
        <div className="flex">
          <p className="text-lg m-0 text-color-secondary	">
            Mol Weight : {molecule.molecularWeight}
          </p>
        </div>
        <div className="flex">
          <p className="text-lg m-0 text-color-secondary	">
            TPSA : {molecule.tpsa}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MLSimilarSearchCard;
