import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { ContextMenu } from "primereact/contextmenu";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { Message } from "primereact/message";
import { Sidebar } from "primereact/sidebar";
import { Timeline } from "primereact/timeline";
import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { RootStoreContext } from "../../stores/rootStore";
import FDate from "../FDate/FDate";
import FailedLoading from "../FailedLoading/FailedLoading";
import PleaseWait from "../PleaseWait/PleaseWait";
import SmilesViewWithDetails from "../SmilesViewWithDetails/SmilesViewWithDetails";
import StageTag from "../StageTag/StageTag";
import CompoundEvolutionAddNew from "./CompoundEvolutionAddNew/CompoundEvolutionAddNew";
import CompoundEvolutionDelete from "./CompoundEvolutionDelete/CompoundEvolutionDelete";
import CompoundEvolutionEdit from "./CompoundEvolutionEdit/CompoundEvolutionEdit";
import "./CompoundEvolutionTimeline.css";
const CompoundEvolutionTimeline = ({
  project,
  stageFilter,
  disableAdd,
  enableEdit = false,
  enableDelete = false,
}) => {
  const cmEvolution = useRef(null);
  const [displayAddStructureForm, setDisplayAddStructureForm] = useState(false);
  const [selectedCEinCM, setSelectedCEinCM] = useState();
  const [displayEditContainer, setDisplayEditContainer] = useState(false);
  const [displayDeleteContainer, setDisplayDeleteContainer] = useState(false);

  const rootStore = useContext(RootStoreContext);
  const {
    isLoadingCompoundEvolution,
    fetchCompoundEvolution,
    selectedCompoundEvolution,
  } = rootStore.compoundEvolutionStore;

  const { loadingProject } = rootStore.projectStore;

  useEffect(() => {
    fetchCompoundEvolution(project.id);
  }, [fetchCompoundEvolution, project]);

  if (loadingProject || isLoadingCompoundEvolution) {
    return <PleaseWait />;
  }

  const cmEvolutionItems = [];

  cmEvolutionItems.push({
    label: "Copy Compound GUID",
    icon: "icon icon-common icon-orcid",
    command: (e) => {
      let cGUID = getCompoundEvolutionEntry(selectedCEinCM).id;
      navigator.clipboard.writeText(cGUID);
      toast.success("Copied " + cGUID + " to clipboard");
    },
  });

  if (enableEdit) {
    cmEvolutionItems.push({
      label: "Edit",
      icon: "pi pi-tablet",
      command: (e) => {
        setDisplayEditContainer(true);
      },
    });
  }

  if (enableDelete) {
    cmEvolutionItems.push({
      label: "Delete",
      icon: "pi pi-trash",
      command: (e) => {
        setDisplayDeleteContainer(true);
      },
    });
  }

  let onEvolutionContextMenuShow = (e, id) => {
    cmEvolution.current.show(e);
    setSelectedCEinCM(id);
  };

  let getCompoundEvolutionEntry = (id) =>
    selectedCompoundEvolution.filter((e) => e.id === id)[0];

  if (!loadingProject && !isLoadingCompoundEvolution) {
    let evolutionData = selectedCompoundEvolution;
    if (stageFilter && selectedCompoundEvolution) {
      evolutionData = [
        ...selectedCompoundEvolution.filter(
          (e) => e.addedOnStage === stageFilter
        ),
      ];
    }
    const customizedContent = (item) => {
      return (
        <div className="flex flex-column">
          <div className="flex">
            <SmilesViewWithDetails
              compound={item.compound}
              width={300}
              height={300}
            />
          </div>
          <ContextMenu model={cmEvolutionItems} ref={cmEvolution} />
          <div
            id={item.id}
            onContextMenu={(e) => onEvolutionContextMenuShow(e, item.id)}
          >
            <div
              className="flex"
              style={{
                lineHeight: "1.5rem",
                marginRight: "50px",
                minWidth: "150px",
              }}
            >
              Ext Id : {item.compound.externalCompoundIds} <br />
              Mol Weight : {item.compound.molWeight} <br />
              Mol Area : {item.compound.molArea} <br />
              IC50 : {item.iC50} (&micro;M) <br />
              MIC : {item.mic} (&micro;M)
              <br />
            </div>
            <div className="flex flex-column">
              <Divider align="left">
                <div className="flex">
                  <i className="pi pi-info-circle mr-2"></i>
                  <b>Notes</b>
                </div>
              </Divider>
              {item.notes}
            </div>
          </div>
        </div>
      );
    };

    const customizedOppositeContent = (item) => {
      return (
        <Chip
          label={<FDate timestamp={item.addedOnDate} hideTime={true} />}
          style={{ fontSize: "small" }}
        />
      );
    };

    const customizedMarker = (item) => {
      return <StageTag stage={item.addedOnStage} />;
    };

    return (
      <React.Fragment>
        <div className="flex flex-column w-full compound-evolution-timeline">
          <div className="flex">
            <Divider align="right">
              <Button
                label="Add a compound"
                icon="pi pi-plus"
                className="p-button-outlined"
                onClick={() => setDisplayAddStructureForm(true)}
                disabled={disableAdd}
              ></Button>
            </Divider>
          </div>
          <div className="flex">
            <Timeline
              value={evolutionData}
              className="customized-timeline"
              marker={customizedMarker}
              content={customizedContent}
              opposite={customizedOppositeContent}
            />
          </div>
        </div>

        <Sidebar
          visible={displayAddStructureForm}
          position="right"
          style={{ width: "30em", overflowX: "auto" }}
          onHide={() => setDisplayAddStructureForm(false)}
        >
          <h3>{project.projectName}| Add a compound</h3>

          <hr />
          <Message
            severity="info"
            text={`This would add a new compound to stage ${project.currentStage}`}
          />
          <br />
          <br />
          <CompoundEvolutionAddNew
            closeSidebar={() => setDisplayAddStructureForm(false)}
          />
        </Sidebar>

        <Dialog
          header={"Edit Compound Evolution Entry"}
          visible={displayEditContainer}
          closable={true}
          draggable={true}
          style={{ width: "50vw" }}
          onHide={() => setDisplayEditContainer(false)}
        >
          <CompoundEvolutionEdit
            evolution={() => getCompoundEvolutionEntry(selectedCEinCM)}
            onHide={() => setDisplayEditContainer(false)}
          />
        </Dialog>

        <Dialog
          className="bg-red-50"
          header={"Delete Compound Evolution Entry"}
          visible={displayDeleteContainer}
          closable={true}
          draggable={true}
          style={{ width: "50vw" }}
          onHide={() => setDisplayDeleteContainer(false)}
        >
          <CompoundEvolutionDelete
            evolution={() => getCompoundEvolutionEntry(selectedCEinCM)}
            onHide={() => setDisplayDeleteContainer(false)}
          />
        </Dialog>
      </React.Fragment>
    );
  }

  return <FailedLoading />;
};

export default observer(CompoundEvolutionTimeline);
