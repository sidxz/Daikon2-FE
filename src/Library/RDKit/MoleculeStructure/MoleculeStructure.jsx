import { Skeleton } from "primereact/skeleton";
import React, { useEffect, useState } from "react";
import { loadRDKit } from "../utils/rdkitLoader"; // Adjust the path as needed
import "./MoleculeStructure.css";

const MoleculeStructure = ({
  id = "",
  className = "",
  svgMode = true,
  width = 250,
  height = 250,
  structure,
  subStructure,
  extraDetails = {},
  drawingDelay,
}) => {
  const [svg, setSvg] = useState(undefined);
  const [rdKitLoaded, setRdKitLoaded] = useState(false);
  const [rdKitError, setRdKitError] = useState(false);
  const [renderError, setRenderError] = useState(false);

  const MOL_DETAILS = {
    width: width,
    height: height,
    bondLineWidth: 1,
    addStereoAnnotation: true,
    ...extraDetails,
  };

  useEffect(() => {
    let isMounted = true; // To avoid setting state on unmounted component

    const initializeRDKit = async () => {
      try {
        const RDKit = await loadRDKit();
        if (!isMounted) return;
        setRdKitLoaded(true);

        const isValidSMILES = (smiles) => {
          try {
            const mol = RDKit.get_mol(smiles);
            if (mol) {
              mol.delete(); // Clean up to prevent memory leaks
              return true;
            }
            return false;
          } catch {
            return false;
          }
        };

        // Validate main structure
        if (!isValidSMILES(structure)) {
          setRenderError(true);
          console.error("Invalid main SMILES structure.");
          return;
        }

        // Validate substructure if provided
        let validSubStructure = undefined;
        if (subStructure && isValidSMILES(subStructure)) {
          validSubStructure = subStructure;
        }

        const drawMolecule = () => {
          try {
            const mol = RDKit.get_mol(structure);
            let molDetails = { ...MOL_DETAILS };

            if (validSubStructure) {
              const qmol = RDKit.get_qmol(validSubStructure);
              const matches = mol.get_substruct_match(qmol);

              if (matches) {
                const parsedMatches = JSON.parse(matches);

                if (
                  parsedMatches &&
                  parsedMatches.atoms &&
                  parsedMatches.atoms.length > 0
                ) {
                  const highlightDetails = {
                    atoms: parsedMatches.atoms,
                    bonds: parsedMatches.bonds,
                    highlight_atom_colors: {},
                    highlight_bond_colors: {},
                    highlight_color: [0, 1, 0, 1], // RGBA for green
                  };
                  molDetails = { ...molDetails, ...highlightDetails };
                } else {
                  console.warn("Substructure not found in the main structure.");
                  setRenderError(false); // Substructure not found but not an error
                }
              } else {
                console.warn("No substructure matches found.");
                setRenderError(false); // No matches found but not an error
              }
              qmol.delete();
            }

            if (svgMode) {
              const svgContent = mol.get_svg_with_highlights(
                JSON.stringify(molDetails)
              );
              if (isMounted) setSvg(svgContent);
            } else {
              const canvas = document.getElementById(id);
              if (canvas) {
                mol.draw_to_canvas_with_highlights(
                  canvas,
                  JSON.stringify(molDetails)
                );
              }
            }
            mol.delete();
          } catch (error) {
            console.error("Error during molecule rendering:", error);
            if (isMounted) setRenderError(true);
          }
        };

        if (drawingDelay) {
          setTimeout(drawMolecule, drawingDelay);
        } else {
          drawMolecule();
        }
      } catch (error) {
        console.error("Error loading RDKit:", error);
        if (isMounted) setRdKitError(true);
      }
    };

    initializeRDKit();

    return () => {
      isMounted = false; // Cleanup flag on unmount
    };
  }, [
    structure,
    subStructure,
    svgMode,
    width,
    height,
    extraDetails,
    drawingDelay,
    id,
  ]);

  if (rdKitError) {
    return <div>Error loading RDKit renderer.</div>;
  }

  if (renderError) {
    return <div>Error rendering the molecule structure.</div>;
  }

  if (!rdKitLoaded || !svg) {
    return <Skeleton width={width} height={height}></Skeleton>;
  }

  if (!svgMode) {
    return (
      <div className={`molecule-canvas-container ${className}`}>
        <canvas
          title={structure}
          id={id}
          width={width}
          height={height}
        ></canvas>
      </div>
    );
  }

  return (
    <div
      title={structure}
      className={`molecule-structure-svg ${className}`}
      style={{ width, height }}
      dangerouslySetInnerHTML={{ __html: svg }}
    ></div>
  );
};

export default MoleculeStructure;
