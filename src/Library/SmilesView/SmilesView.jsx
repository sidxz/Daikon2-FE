import { observer } from "mobx-react-lite";
import { ContextMenu } from "primereact/contextmenu";
import { Tag } from "primereact/tag";
import { Tooltip } from "primereact/tooltip";
import { useRef } from "react";
import { FcPrivacy } from "react-icons/fc";
import { VscSearchFuzzy } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AIDocumentIcon } from "../../Apps/Flow/icons/AIDocumentIcon";
import { DiscloseIcon } from "../../Apps/MolecuLogix/Icons/DiscloseIcon";
import { ML_GENERATED_TOOLTIP } from "../../constants/strings";
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
      icon: (
        <div className="flex mr-2">
          <DiscloseIcon size="18" />
        </div>
      ),
      command: () => {
        navigate(
          `/moleculogix/disclose/?inputName=${requestedCompoundName}&inputId=${compoundId}`
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
              style={{
                background: "#ffb74d",
              }}
              tooltipOptions={{ showDelay: 1000, hideDelay: 300 }}
              className="rdk_pains"
              icon="pi pi-exclamation-triangle"
              data-pr-tooltip="This compound has been identified as a possible PAINS 
                (Pan-Assay Interference Compound) by RDKit. While this may be a false positive, 
                we recommend reviewing it carefully before proceeding."
            >
              <div className="flex align-items-center">
                <span className="text-xs text-color">PAINS</span>
              </div>
            </Tag>
          </div>
        );
      }
    }
  };

  const MLGeneratedTag = (labelClass, tagText, toolTipText) => (
    <div className="flex">
      <Tooltip target={`.${labelClass}`}>
        {toolTipText} <br />
        {ML_GENERATED_TOOLTIP}
      </Tooltip>
      <Tag
        style={{
          background:
            "linear-gradient(135deg, #fff3e0 0%, #ffcc80 40%, #fb8c00 100%)",
        }}
        className={labelClass}
        tooltipOptions={{ showDelay: 1000, hideDelay: 300 }}
      >
        <div className="flex align-items-center">
          <AIDocumentIcon className="mr-2" />
          <span className="text-xs text-color">{tagText}</span>
        </div>
      </Tag>
    </div>
  );

  let generateNuisanceFlag = () => {
    let tags = [];
    if (compound?.predictions?.nuisanceRequestStatus === 0) {
      tags.push(
        <div className="flex">
          <Tooltip target=".nuisance_flag" />
          <Tag
            style={{
              background: "#CCCCCC",
            }}
            className="nuisance_flag"
            value="AI/ML Predictions"
            icon="pi pi-clock"
            data-pr-tooltip="The AI model is still analyzing this compound. Please check back later for the results."
          ></Tag>
        </div>
      );
    }
    if (
      compound?.predictions?.nuisanceModelPredictions[0]?.labelReactive === 1
    ) {
      tags.push(
        MLGeneratedTag(
          "labelReactive",
          "Nuisance - Reactive",
          "The AI model has identified this compound as potentially reactive."
        )
      );
    }

    if (
      compound?.predictions?.nuisanceModelPredictions[0]?.labelAggregator === 1
    ) {
      tags.push(
        MLGeneratedTag(
          "labelAggregator",
          "Nuisance - Aggregator",
          "The AI model has identified this compound as a potential aggregator."
        )
      );
    }

    if (
      compound?.predictions?.nuisanceModelPredictions[0]?.labelPromiscuous === 1
    ) {
      tags.push(
        MLGeneratedTag(
          "labelPromiscuous",
          "Nuisance - Promiscuous",
          "The AI model has identified this compound as potentially promiscuous."
        )
      );
    }

    if (
      compound?.predictions?.nuisanceModelPredictions[0]
        ?.labelLuciferaseInhibitor === 1
    ) {
      tags.push(
        MLGeneratedTag(
          "labelLuciferaseInhibitor",
          "Nuisance - LucF Inhibitor",
          "The AI model has identified this compound as a potential luciferase inhibitor."
        )
      );
    }

    return <div className="flex gap-1 flex-wrap">{tags}</div>;
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
      <div className="flex justify-content-start w-full pt-1 gap-1">
        {generatePainsFlag()}
        {generateNuisanceFlag()}
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
