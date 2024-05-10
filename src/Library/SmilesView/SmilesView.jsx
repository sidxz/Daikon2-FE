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
    {
      label: "Find Similar",
      icon: "icon icon-common icon-search",
      command: () => {
        navigate(`/moleculogix/search/${smiles}`);
      },
    },
  ];
  if (compoundId) {
    contextMenuItems.push({
      label: "View Compound",
      icon: "icon icon-common icon-math",
      command: () => {
        navigate("/moleculogix/molecule/" + compoundId);
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
      <div
        className="flex justify-content-center"
        style={{ width: width, height: height }}
      >
        <div className="flex flex-row align-items-center justify-content-center gap-2">
          <div className="flex">
            <FcPrivacy />
          </div>
          <div className="flex align-items-center">UNDISCLOSED</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-w-max justify-content-center align-items-center border-0">
      <ContextMenu model={contextMenuItems} ref={cm} />
      <svg
        id={canId}
        ref={svgElementRef}
        data-smiles={smiles}
        onContextMenu={(e) => cm.current.show(e)}
        style={{
          width: width,
          height: height,
          marginTop: -0,
          padding: 0,
          marginBottom: 0,
        }}
      />
    </div>
  );
};

export default SmilesView;
