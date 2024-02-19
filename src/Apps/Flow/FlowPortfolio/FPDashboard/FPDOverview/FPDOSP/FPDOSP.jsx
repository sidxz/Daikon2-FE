import React from "react";
import FDate from "../../../../../../Library/FDate/FDate";
import SmilesView from "../../../../../../Library/SmilesView/SmilesView";

const FPDOSP = () => {
  return (
    <div className="flex flex-column w-full shadow-1 hover:shadow-3">
      <div className="flex flex-column  justify-content-center cursor-pointer ">
        <div className="flex flex-column bg-orange-100  justify-content-center ">
          <div className="flex p-2 text-lg text-orange-800 justify-content-center">
            Project name
          </div>
        </div>
        <div className="flex ">
          <div className="flex flex-column justify-content-center  border-orange-100">
            <div
              className="flex justify-content-center w-full p-2 text-orange-600 border-right-1 border-orange-100"
              style={{
                minWidth: "5rem",
              }}
            >
              Screen name
            </div>

            <div
              className="flex flex-column justify-content-center w-full p-2 text-orange-600 border-right-1 border-orange-100"
              style={{
                minWidth: "5rem",
              }}
            >
              Organization
            </div>

            <div
              className="flex flex-column justify-content-center w-full p-2 text-orange-600 border-right-1 border-orange-100"
              style={{
                minWidth: "5rem",
              }}
            >
              <FDate timestamp={new Date().getTime()} color="#CC5500" />
            </div>
            <div
              className="flex flex-column justify-content-center w-full p-2 text-orange-600 border-right-1 border-orange-100"
              style={{
                minWidth: "5rem",
              }}
            >
              <FDate timestamp={new Date().getTime()} color="#CC5500" />
            </div>
          </div>
          <div className="flex w-full justify-content-center">
            <SmilesView smiles="COc(c1)cccc1C#N" width={100} height={100} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FPDOSP;
