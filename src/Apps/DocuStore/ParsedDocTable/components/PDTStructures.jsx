import { Carousel } from "primereact/carousel";
import React from "react";
import SmilesView from "../../../../Library/SmilesView/SmilesView";

const PDTStructures = ({ moleculesView }) => {
  const viewTemplate = (molecule) => {
    return (
      <div className="flex flex-column w-full p-2">
        <div className="flex w-full p-0 justify-content-center">
          <SmilesView
            compoundId={molecule.id}
            smiles={molecule.smilesCanonical}
            width={200}
            height={200}
          />
        </div>
        <div className="flex w-full p-0 justify-content-center">
          {" "}
          {molecule.name}{" "}
        </div>
      </div>
    );
  };

  return (
    <div className="flex border-0">
      <Carousel
        value={moleculesView}
        numVisible={1}
        numScroll={1}
        itemTemplate={viewTemplate}
        orientation="vertical"
        verticalViewPortHeight="250px"
      />
    </div>
  );
};

export default PDTStructures;
