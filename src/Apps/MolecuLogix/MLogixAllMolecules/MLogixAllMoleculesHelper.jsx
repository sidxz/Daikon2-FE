import SmilesView from "../../../Library/SmilesView/SmilesView";

const gridItem = (molecule, navigate) => {
  return (
    <div
      className="flex flex-column border-1 border-50 p-1 cursor-pointer hover:border-200 transition-all duration-200 ease-in-out"
      key={molecule.id}
      onClick={() => navigate(`../molecule/` + molecule.id)}
    >
      <div className="flex flex-column">
        <SmilesView
          smiles={molecule.smilesCanonical}
          compoundId={molecule.id}
        />
      </div>

      <div className="flex gap-1">
        <div className="flex">
          <span>Name:</span>
        </div>
        <div className="flex font-semibold">
          <span>{molecule.name}</span>
        </div>
      </div>

      <div className="flex gap-1">
        <div className="flex">
          <span>Molecular Weight:</span>
        </div>
        <div className="flex font-semibold">
          <span>{molecule.molecularWeight}</span>
        </div>
      </div>
      <div className="flex gap-1">
        <div className="flex">
          <span>TPSA:</span>
        </div>
        <div className="flex font-semibold">
          <span>{molecule.tpsa}</span>
        </div>
      </div>
    </div>
  );
};

export const listTemplate = (moleculeList, navigate) => {
  return (
    <div className="grid grid-nogutter">
      {moleculeList.map((molecule) => gridItem(molecule, navigate))}
    </div>
  );
};
