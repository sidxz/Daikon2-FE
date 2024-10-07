import { observer } from "mobx-react-lite";
import { DataView } from "primereact/dataview";
import { Skeleton } from "primereact/skeleton";
import React, { useCallback, useContext, useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import SmilesView from "../../../../../../Library/SmilesView/SmilesView";
import { RootStoreContext } from "../../../../../../RootStore";

const FHaVAssociatedHits = () => {
  const rootStore = useContext(RootStoreContext);
  const { selectedHa, isFetchingHa } = rootStore.haStore;
  const { fetchMolecules, isFetchingMolecules, moleculeRegistry } =
    rootStore.moleculeStore;

  // Memoize associated molecule IDs for efficiency
  const associatedMoleculeIds = useMemo(
    () => Object.keys(selectedHa?.associatedHitIds || {}),
    [selectedHa]
  );

  // Memoize molecule item template to avoid unnecessary re-renders
  const moleculeItemTemplate = useCallback((molecule, index) => {
    if (!molecule) {
      return <div key={index}>Molecule data not available</div>;
    }

    return (
      <div
        className="flex gap-2 border-1 border-50 p-2 m-1 w-25rem"
        id={molecule.id}
        key={molecule.id}
      >
        <div className="flex border-1 border-50">
          <SmilesView
            smiles={molecule.smilesCanonical}
            subStructure={null}
            width={150}
            height={150}
          />
        </div>
        <div className="flex flex-column gap-1">
          <div className="flex">
            <NavLink to={`/moleculogix/molecule/${molecule.id}`}>
              <p className="text-lg m-0">{molecule.name}</p>
            </NavLink>
          </div>
          <div className="flex">
            <p className="text-sm m-0">Synonyms: {molecule.synonyms}</p>
          </div>
          <div className="flex">
            <p className="m-0 text-color-secondary">
              Mol Mass (g/mol): {molecule.molecularWeight}
            </p>
          </div>
          <div className="flex">
            <p className="m-0 text-color-secondary">
              TPSA (Å²): {molecule.tpsa}
            </p>
          </div>
          <div className="flex">
            <p className="m-0 text-color-secondary">cLog P: {molecule.cLogP}</p>
          </div>
        </div>
      </div>
    );
  }, []);

  useEffect(() => {
    // Fetch molecules when associated molecule IDs are present
    if (associatedMoleculeIds.length > 0) {
      fetchMolecules(associatedMoleculeIds).catch((error) => {
        console.error("Error fetching molecules:", error); // Error handling
      });
    }
  }, [associatedMoleculeIds, fetchMolecules]);

  // Loading state handling
  if (isFetchingHa || isFetchingMolecules) {
    return (
      <Skeleton width="w-full" height="10rem" borderRadius="10px"></Skeleton>
    );
  }

  // Template for rendering the list of molecules
  const moleculeListTemplate = (items) => {
    if (!items || items.length === 0)
      return <p>No associated molecules found.</p>;

    return (
      <div className="flex flex-wrap w-full">
        {items.map((associatedMoleculeId, index) => {
          const molecule = moleculeRegistry.get(associatedMoleculeId);

          // Ensure molecule exists in the registry
          if (!molecule) {
            return (
              <div key={associatedMoleculeId} className="m-1">
                Molecule with ID {associatedMoleculeId} is not available.
              </div>
            );
          }

          return moleculeItemTemplate(molecule, index);
        })}
      </div>
    );
  };

  // Render the associated molecules or a message if none found
  return (
    <div className="card w-full mt-2 fadein animation-duration-500">
      {associatedMoleculeIds.length !== 0 ? (
        <DataView
          className="fadein animation-duration-500"
          value={associatedMoleculeIds}
          listTemplate={moleculeListTemplate}
        />
      ) : (
        <p>No associated hits available.</p>
      )}
    </div>
  );
};

export default observer(FHaVAssociatedHits);
