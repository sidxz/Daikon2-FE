import { ContextMenu } from "primereact/contextmenu";
import React, { useRef } from "react";
import { FcPrivacy } from "react-icons/fc";
import { VscSearchFuzzy } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MoleculeStructure from "../RDKit/MoleculeStructure/MoleculeStructure";

const SmilesView = ({
  smiles,
  subStructure,
  compoundId,
  width = 200,
  height = 200,
}) => {
  const svgElementRef = useRef(null);
  const cm = useRef(null);

  let canId = smiles + Date.now() + Math.floor(Math.random() * 100);
  const navigate = useNavigate();
  let contextMenuItems = [];

  if (compoundId) {
    contextMenuItems.push({
      label: "View molecule",
      icon: "icon icon-common icon-math",
      command: () => {
        navigate("/moleculogix/molecule/" + compoundId);
      },
    });
  }

  contextMenuItems.push({
    label: "Find similar",
    icon: "icon icon-common icon-search",
    command: () => {
      navigate(`/moleculogix/search?smiles=${smiles}&searchType=similarity`);
    },
  });
  contextMenuItems.push({
    label: "Find substructure",
    icon: <VscSearchFuzzy className="mr-2" />,
    command: () => {
      navigate(`/moleculogix/search?smiles=${smiles}&searchType=substructure`);
    },
  });

  contextMenuItems.push({
    label: "Copy SMILES",
    icon: "pi pi-copy",
    command: () => {
      navigator.clipboard.writeText(smiles);
      toast.success("Copied " + smiles + " to clipboard");
    },
  });

  if (
    smiles === "c1ccccc1" ||
    smiles === "C1CCCCC1" ||
    smiles === null ||
    smiles === "" ||
    smiles === "ND" ||
    smiles === undefined
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
    <div
      onContextMenu={(e) => cm.current.show(e)}
      className="flex min-w-max justify-content-center align-items-center border-0"
    >
      <ContextMenu model={contextMenuItems} ref={cm} />
      <MoleculeStructure
        id={canId}
        className={canId}
        structure={smiles}
        subStructure={subStructure}
        width={width}
        height={width}
        onContextMenu={(e) => cm.current.show(e)}
      />
      {/* <svg
        id={canId}
        ref={svgElementRef}
        data-smiles={smiles}
        onContextMenu={(e) => cm.current.show(e)}
        style={{
          width: width,
          height: width,
          marginTop: -0,
          padding: 0,
          marginBottom: 0,
        }}
      /> */}
    </div>
  );
};

export default SmilesView;
