import React, { useState } from "react";
import { Jsme } from "./JSMECore";
import JSMEMenuBar from "./components/JSMEMenuBar";

const JSMEditor = ({ initialSmiles, onSave }) => {
  const [smiles, setSmiles] = useState(initialSmiles);
  const logSmiles = (smiles) => {
    console.log(smiles);
  };
  return (
    <div
      className="flex flex-column w-full border-1 border-100"
      style={{ backgroundColor: "#f5f5f5" }}
    >
      <div className="flex w-full p-1">
        <JSMEMenuBar smiles={smiles} onSave={onSave} />
      </div>
      <div className="flex align-content-center">
        <Jsme
          height={500}
          width={617}
          options="oldlook,star"
          smiles={initialSmiles}
          onChange={(s) => setSmiles(s)}
          //smiles="OC1=C(C2=NC(C3=CC=CS3)=C(C3=CC=CS3)N2)C=C(Br)C=C1"
        />
      </div>
    </div>
  );
};

export default JSMEditor;
