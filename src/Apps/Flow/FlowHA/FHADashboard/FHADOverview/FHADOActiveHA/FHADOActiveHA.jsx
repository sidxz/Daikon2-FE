import React from "react";
import FDate from "../../../../../../Library/FDate/FDate";
import SmilesView from "../../../../../../Library/SmilesView/SmilesView";

const FHaDOActiveHA = () => {
  return (
    <div className="flex flex-column w-full shadow-1 hover:shadow-3">
      <div className="flex flex-column  justify-content-center cursor-pointer">
        <div className="flex flex-column bg-blue-100 justify-content-center">
          <div
            className="flex p-2 text-lg text-blue-800 justify-content-center"
            style={{
              minWidth: "7rem",
            }}
          >
            Project name
          </div>
        </div>

        <div className="flex justify-content-center  border-bottom-1 border-blue-100">
          <div
            className="flex justify-content-center w-4 p-2 text-blue-600 border-right-1 border-blue-100"
            style={{
              minWidth: "4rem",
            }}
          >
            Screen name
          </div>

          <div
            className="flex justify-content-center w-4 p-2 text-blue-600 border-right-1 border-blue-100"
            style={{
              minWidth: "4rem",
            }}
          >
            Organization
          </div>

          <div
            className="flex justify-content-center w-4 p-2 text-blue-600 border-right-1 border-blue-100"
            style={{
              minWidth: "4rem",
            }}
          >
            <FDate timestamp={new Date().getTime()} color="#1c80cf" />
          </div>
        </div>
        <div className="flex w-full justify-content-center">
          <SmilesView
            smiles="CC(=O)NCCc1c[nH]c2ccc(OC)cc12"
            width={180}
            height={180}
          />
        </div>
      </div>
    </div>
  );
};

export default FHaDOActiveHA;
