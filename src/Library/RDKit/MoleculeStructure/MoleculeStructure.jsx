import { Skeleton } from "primereact/skeleton";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { loadRDKit } from "../utils/rdkitLoader"; // Adjust the path as needed
import "./MoleculeStructure.css";

const MoleculeStructure = ({
  id,
  className,
  svgMode,
  width,
  height,
  structure,
  subStructure,
  extraDetails,
  drawingDelay,
}) => {
  const [svg, setSvg] = useState(undefined);
  const [rdKitLoaded, setRdKitLoaded] = useState(false);
  const [rdKitError, setRdKitError] = useState(false);

  const MOL_DETAILS = {
    width: width,
    height: height,
    bondLineWidth: 1,
    addStereoAnnotation: true,
    ...extraDetails,
  };

  const drawMolecule = (RDKit) => {
    const mol = RDKit.get_mol(structure || "invalid");
    const qmol = RDKit.get_qmol(subStructure || "invalid");

    if (!mol) {
      return;
    }

    const molDetails = getMolDetails(mol, qmol);

    if (svgMode) {
      const svgContent = mol.get_svg_with_highlights(molDetails);
      setSvg(svgContent);
    } else {
      const canvas = document.getElementById(id);
      if (canvas) {
        mol.draw_to_canvas_with_highlights(canvas, molDetails);
      }
    }

    //mol.delete();
    //qmol.delete();
  };

  const getMolDetails = (mol, qmol) => {
    if (mol && qmol) {
      const subStructHighlightDetails = JSON.parse(
        mol.get_substruct_matches(qmol)
      );
      const subStructHighlightDetailsMerged = subStructHighlightDetails.reduce(
        (acc, { atoms, bonds }) => ({
          atoms: [...acc.atoms, ...atoms],
          bonds: [...acc.bonds, ...bonds],
        }),
        { bonds: [], atoms: [] }
      );
      return JSON.stringify({
        ...MOL_DETAILS,
        ...subStructHighlightDetailsMerged,
      });
    } else {
      return JSON.stringify(MOL_DETAILS);
    }
  };

  useEffect(() => {
    const initializeRDKit = async () => {
      try {
        const RDKit = await loadRDKit();
        setRdKitLoaded(true);
        if (drawingDelay) {
          setTimeout(() => drawMolecule(RDKit), drawingDelay);
        } else {
          drawMolecule(RDKit);
        }
      } catch (error) {
        console.error(error);
        setRdKitError(true);
      }
    };

    initializeRDKit();
  }, [
    structure,
    subStructure,
    svgMode,
    width,
    height,
    extraDetails,
    drawingDelay,
  ]);

  if (rdKitError) {
    return "Error loading renderer.";
  }

  if (!rdKitLoaded) {
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

MoleculeStructure.propTypes = {
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
  svgMode: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
  structure: PropTypes.string.isRequired,
  subStructure: PropTypes.string,
  extraDetails: PropTypes.object,
  drawingDelay: PropTypes.number,
};

MoleculeStructure.defaultProps = {
  subStructure: "",
  className: "",
  width: 250,
  height: 200,
  svgMode: true,
  extraDetails: {},
  drawingDelay: undefined,
};

export default MoleculeStructure;
