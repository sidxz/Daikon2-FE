import { ContextMenu } from "primereact/contextmenu";
import React, { useEffect, useRef } from "react";
import { FcPrivacy } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SmilesDrawer from "smiles-drawer";

const SmilesView = ({ smiles, compoundId, width = 200, height = 200 }) => {
  const svgElementRef = useRef(null);
  const cm = useRef(null);

  let canId = smiles + Date.now() + Math.floor(Math.random() * 100);

  useEffect(() => {
    let SETTINGS = { width: width, height: height, bondThickness: 1.0 };

    // Initialize the drawer to draw to canvas
    const drawer = new SmilesDrawer.SvgDrawer(SETTINGS);
    SmilesDrawer.parse(smiles, (tree) => {
      drawer.draw(tree, svgElementRef.current, "light");
    });
  }, [height, smiles, width, canId]);

  const navigate = useNavigate();

  const contextMenuItems = [
    {
      label: "Copy Smiles String",
      icon: "icon icon-conceptual icon-structures",
      command: () => {
        navigator.clipboard.writeText(smiles);
        toast.success("Copied " + smiles + " to clipboard");
      },
    },
  ];
  if (compoundId) {
    contextMenuItems.push({
      label: "View Compound",
      icon: "icon icon-common icon-math",
      command: () => {
        navigate("/tools/compounds/" + compoundId);
      },
    });
  }

  if (
    smiles === "c1ccccc1" ||
    smiles === "C1CCCCC1" ||
    smiles === null ||
    smiles === "" ||
    smiles === "ND"
  ) {
    return (
      <div className="flex min-w-max">
        <div className="flex flex-row justify-content-center gap-2">
          <div className="flex">
            <FcPrivacy />
          </div>
          <div className="flex">UNDISCLOSED</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-w-max justify-content-center align-items-center">
      <ContextMenu model={contextMenuItems} ref={cm} />
      <svg
        id={canId}
        ref={svgElementRef}
        data-smiles={smiles}
        onContextMenu={(e) => cm.current.show(e)}
        style={{ width: width, height: height }}
      />
    </div>
  );
};

export default SmilesView;
