import { observer } from "mobx-react-lite";
import { ContextMenu } from "primereact/contextmenu";
import { Tag } from "primereact/tag";
import { Tooltip } from "primereact/tooltip";
import React, { useRef } from "react";
import { FcPrivacy } from "react-icons/fc";
import { VscSearchFuzzy } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { DiscloseIcon } from "../../Apps/MolecuLogix/Icons/DiscloseIcon";
import MoleculeStructure from "../RDKit/MoleculeStructure/MoleculeStructure";
const SmilesView = ({
  compound,
  smiles,
  subStructure,
  compoundId,
  width = 200,
  height = 200,
  requestedCompoundName = "",
}) => {
  const svgElementRef = useRef(null);
  const cm = useRef(null);
  const cmUndisclosed = useRef(null);

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

  let undisclosedContextMenuItems = [
    {
      label: "Disclose Molecule",
      icon: <DiscloseIcon className="mr-2" width="12px" height="12px" />,
      command: () => {
        navigate(
          `/moleculogix/disclose/pre?inputName=${requestedCompoundName}&inputId=${compoundId}`
        );
      },
    },
  ];

  let generatePainsFlag = () => {
    if (compound?.pains) {
      if (compound?.pains?.rdKitPains) {
        return (
          <div className="flex">
            <Tooltip target=".rdk_pains" />
            <Tag
              className="rdk_pains"
              severity="warning"
              value="RDK_PAINS"
              icon="pi pi-exclamation-triangle"
              data-pr-tooltip="This compound has been identified as a possible PAINS 
                (Pan-Assay Interference Compound) by RDKit. While this may be a false positive, 
                we recommend reviewing it carefully before proceeding."
            ></Tag>
          </div>
        );
      }
    }
  };

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
        onContextMenu={(e) => cmUndisclosed.current.show(e)}
        className="flex flex-column min-w-max justify-content-center align-items-center border-0"
      >
        <ContextMenu model={undisclosedContextMenuItems} ref={cmUndisclosed} />
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
      </div>
    );
  }

  return (
    <div
      onContextMenu={(e) => cm.current.show(e)}
      className="flex flex-column min-w-max justify-content-center align-items-center border-0"
    >
      <ContextMenu model={contextMenuItems} ref={cm} />
      <div className="flex justify-content-start w-full pt-1">
        {generatePainsFlag()}
      </div>

      <div className="flex">
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
    </div>
  );
};

export default observer(SmilesView);
