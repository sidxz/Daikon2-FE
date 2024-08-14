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
  const [svg, setSvg] = useState(null);
  const [rdKitLoaded, setRdKitLoaded] = useState(false);
  const [rdKitError, setRdKitError] = useState(false);
  const [renderError, setRenderError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let timeoutId = null;

    const MOL_DETAILS = {
      width,
      height,
      bondLineWidth: 1,
      addStereoAnnotation: true,
      ...extraDetails,
    };

    const initializeRDKit = async () => {
      try {
        const RDKit = await loadRDKit();
        if (!isMounted) return;

        setRdKitLoaded(true);

        if (!isValidSMILES(RDKit, structure)) {
          console.error("Invalid SMILES structure.");
          setRenderError(true);
          return;
        }

        const validatedSubStructure =
          subStructure && isValidSMILES(RDKit, subStructure)
            ? subStructure
            : null;

        const drawMolecule = () => {
          let mol, qmol;
          try {
            mol = RDKit.get_mol(structure);
            let molDetails = { ...MOL_DETAILS };

            if (validatedSubStructure) {
              qmol = RDKit.get_qmol(validatedSubStructure);
              const matches = mol.get_substruct_match(qmol);
              if (matches) {
                const parsedMatches = JSON.parse(matches);
                if (parsedMatches?.atoms?.length > 0) {
                  molDetails = {
                    ...molDetails,
                    atoms: parsedMatches.atoms,
                    bonds: parsedMatches.bonds,
                    highlight_atom_colors: {},
                    highlight_bond_colors: {},
                    highlight_color: [0, 1, 0, 1],
                  };
                } else {
                  console.warn("Substructure not found in the main structure.");
                }
              }
            }

            renderMolecule(mol, molDetails);
          } catch (error) {
            console.error("Error during molecule rendering:", error);
            setRenderError(true);
          } finally {
            if (mol) mol.delete();
            if (qmol) qmol.delete();
          }
        };

        if (drawingDelay) {
          timeoutId = setTimeout(drawMolecule, drawingDelay);
        } else {
          drawMolecule();
        }
      } catch (error) {
        console.error("Error loading RDKit:", error);
        setRdKitError(true);
      }
    };

    const isValidSMILES = (RDKit, smiles) => {
      let mol;
      try {
        mol = RDKit.get_mol(smiles);
        return mol !== null;
      } catch {
        return false;
      } finally {
        if (mol) mol.delete();
      }
    };

    const renderMolecule = (mol, molDetails) => {
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
    };

    initializeRDKit();

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
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

  if (rdKitError) return <div>Error loading RDKit renderer.</div>;
  if (renderError) return <div>Error rendering the molecule structure.</div>;
  if (!rdKitLoaded || !svg) return <Skeleton width={width} height={height} />;

  return svgMode ? (
    <div
      title={structure}
      className={`molecule-structure-svg ${className}`}
      style={{ width, height }}
      dangerouslySetInnerHTML={{ __html: svg }}
    ></div>
  ) : (
    <div className={`molecule-canvas-container ${className}`}>
      <canvas id={id} title={structure} width={width} height={height} />
    </div>
  );
};

export default MoleculeStructure;
