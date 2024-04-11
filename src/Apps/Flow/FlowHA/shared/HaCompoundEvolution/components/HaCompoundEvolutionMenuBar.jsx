import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import React from "react";

const HaCompoundEvolutionMenuBar = ({ setDisplayAddCEvoSideBar }) => {
  return (
    <div className="flex flex-row w-full">
      <div className="flex justify-content-start"></div>
      <div className="flex justify-content-end w-full">
        <div className="flex flex-grow min-w-max">
          <Button
            type="button"
            icon="pi pi-plus"
            label="Add Compound Evolution"
            className="p-button-text p-button-sm"
            style={{ margin: "0px", padding: "0px" }}
            onClick={() => setDisplayAddCEvoSideBar(true)}
          />
        </div>
        <div className="flex flex-grow min-w-max"></div>
      </div>
    </div>
  );
};

export default observer(HaCompoundEvolutionMenuBar);
