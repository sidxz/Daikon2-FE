import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { confirmPopup } from "primereact/confirmpopup";
import { Divider } from "primereact/divider";
import { Sidebar } from "primereact/sidebar";
import { Tag } from "primereact/tag";
import React, { useContext, useState } from "react";
import FDate from "../../../../../Library/FDate/FDate";
import PleaseWait from "../../../../../Library/PleaseWait/PleaseWait";
import SmilesView from "../../../../../Library/SmilesView/SmilesView";
import { RootStoreContext } from "../../../../../RootStore";
import PortfolioCompoundEvolutionAdd from "./components/PortfolioCompoundEvolutionAdd";
import PortfolioCompoundEvolutionEdit from "./components/PortfolioCompoundEvolutionEdit";
import PortfolioCompoundEvolutionMenuBar from "./components/PortfolioCompoundEvolutionMenuBar";

const PortfolioCompoundEvolution = () => {
  const rootStore = useContext(RootStoreContext);
  const { selectedProject, isFetchingProject } = rootStore.projectStore;
  const {
    isDeletingProjectCEvo,
    isAddingProjectCEvo,
    isUpdatingProjectCEvo,
    deleteProjectCEvo,
  } = rootStore.projectCompoundEvoStore;

  const [displayAddCEvoSideBar, setDisplayAddCEvoSideBar] = useState(false);
  const [displayEditCEvoSideBar, setDisplayEditCEvoSideBar] = useState(false);
  const [selectedCEvo, setSelectedCEvo] = useState(null);
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);

  if (
    isFetchingProject ||
    isDeletingProjectCEvo ||
    isAddingProjectCEvo ||
    isUpdatingProjectCEvo
  ) {
    return <PleaseWait />;
  }

  const addCEvoSideBarHeader = (
    <div className="flex align-items-center gap-2">
      <i className="icon icon-common icon-plus-circle"></i>
      <span className="font-bold">Add Compound Evolution</span>
    </div>
  );

  const editCEvoSideBarHeader = (
    <div className="flex align-items-center gap-2">
      <i className="icon icon-common icon-pencil"></i>
      <span className="font-bold">Edit Compound Evolution</span>
    </div>
  );

  const onEditCEvoBtnClick = (cEvo) => {
    setSelectedCEvo(cEvo);
    setDisplayEditCEvoSideBar(true);
  };

  const onDeleteBtnClick = (event, cEvo) => {
    const accept = () => {
      //console.log("Delete");
      deleteProjectCEvo(selectedProject.id, cEvo.id);
    };

    const reject = () => {
      console.log("Cancel");
    };

    //console.log(cEvo);
    confirmPopup({
      target: event.currentTarget,
      message: "Do you want to delete this record?",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      rejectClassName: "p-button-secondary",
      accept,
      reject,
    });

    // confirm deletion
  };

  return (
    <div className="flex flex-column p-align-center w-full">
      <div className="flex ">
        <PortfolioCompoundEvolutionMenuBar
          setDisplayAddCEvoSideBar={setDisplayAddCEvoSideBar}
        />
      </div>
      <div className="flex flex-wrap">
        {selectedProject?.compoundEvolution?.map((evo, index) => (
          <div key={"loop_flex_" + evo.id} className="flex">
            <div className="flex flex-column mb-4">
              <div className="flex">
                <Divider align="left" type="solid">
                  <div className="flex gap-1">
                    <div className="flex">
                      <Tag value={evo?.stage} />
                    </div>
                    <div className="flex">
                      <Chip label={<FDate timestamp={evo?.evolutionDate} />} />
                    </div>
                    <div className="flex align-items-center">
                      <i className="pi pi-arrow-right text-xs text-200" />
                    </div>
                    <div className="flex align-items-center text-sm text-500">
                      {index == 0 ? "(Initial)" : ""}
                      {index == selectedProject?.compoundEvolution.length - 1
                        ? "(Latest)"
                        : ""}
                    </div>
                  </div>
                </Divider>
              </div>
              <div
                className="flex flex-column pl-2 pr-2 border-1 border-100 border-round-md mr-2"
                style={{ position: "relative" }}
              >
                <div
                  className="flex"
                  style={{
                    position: "absolute",
                    top: "0",
                    right: "0",
                  }}
                >
                  <Button
                    icon="pi pi-pencil"
                    rounded
                    text
                    severity="secondary"
                    aria-label="Edit"
                    className="p-button-text p-button-sm p-0 m-0"
                    onClick={() => onEditCEvoBtnClick(evo)}
                  />
                  <Button
                    icon="pi pi-trash"
                    rounded
                    text
                    severity="secondary"
                    aria-label="Delete"
                    className="p-button-text p-button-sm p-0 m-0"
                    onClick={(e) => onDeleteBtnClick(e, evo)}
                  />
                </div>
                <div
                  className="flex align-items-center justify-content-center"
                  style={{ width: "300px", height: "300px" }}
                >
                  <SmilesView
                    smiles={evo?.molecule?.smiles}
                    width={300}
                    height={300}
                  />
                </div>

                <div className="flex gap-2 border-1 border-100 border-round-md w-27rem">
                  <table className="table">
                    <thead>
                      <tr>
                        <th
                          className="font-normal border-right-1 border-50"
                          style={{ textAlign: "left", paddingRight: "10px" }}
                        >
                          Name
                        </th>
                        <th
                          className="font-normal border-right-1 border-50"
                          style={{ textAlign: "left", paddingRight: "8px" }}
                        >
                          IC50 (µM)
                        </th>
                        <th
                          className="font-normal border-right-1 border-50"
                          style={{ textAlign: "left", paddingRight: "8px" }}
                        >
                          MIC (µM)
                        </th>
                        <th
                          className="font-normal border-right-1 border-50"
                          style={{ textAlign: "left", paddingRight: "8px" }}
                        >
                          MW
                        </th>
                        <th
                          className="font-normal"
                          style={{ textAlign: "left", paddingRight: "8px" }}
                        >
                          TPSA
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td
                          className="border-right-1 border-50"
                          style={{ textAlign: "left", paddingRight: "10px" }}
                        >
                          {evo?.molecule?.name}
                        </td>
                        <td
                          className="border-right-1 border-50"
                          style={{ textAlign: "left", paddingRight: "8px" }}
                        >
                          {evo?.iC50}
                        </td>

                        <td
                          className="border-right-1 border-50"
                          style={{ textAlign: "left", paddingRight: "8px" }}
                        >
                          {evo?.mic}
                        </td>
                        <td
                          className="border-right-1 border-50"
                          style={{ textAlign: "left", paddingRight: "8px" }}
                        >
                          {evo?.molecule?.molecularWeight}
                        </td>
                        <td style={{ textAlign: "left", paddingRight: "8px" }}>
                          {evo?.molecule?.tpsa}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex gap-2 pr-2 pl-1 border-1 border-50 pb-1 align-items-center border-round-md">
                  <div className="flex" style={{ width: "200px" }}>
                    Notes :{" "}
                    {evo?.notes?.length > 20 && !isNotesExpanded
                      ? evo?.notes?.substring(0, 20) + "..."
                      : evo?.notes}
                  </div>
                  {evo?.notes?.length > 20 && (
                    <div className="flex">
                      <Button
                        label={isNotesExpanded ? "| Collapse" : "Expand"}
                        link
                        className="p-button-text p-button-sm p-0 m-0"
                        onClick={() => setIsNotesExpanded(!isNotesExpanded)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* <div className="flex">
            <Divider align="center" />
          </div> */}
          </div>
        ))}
      </div>
      <Sidebar
        visible={displayAddCEvoSideBar}
        position="right"
        onHide={() => setDisplayAddCEvoSideBar(false)}
        className="p-sidebar-sm"
        header={addCEvoSideBarHeader}
      >
        <PortfolioCompoundEvolutionAdd
          project={selectedProject}
          closeSideBar={() => setDisplayAddCEvoSideBar(false)}
        />
      </Sidebar>

      <Sidebar
        visible={displayEditCEvoSideBar}
        position="right"
        onHide={() => setDisplayEditCEvoSideBar(false)}
        className="p-sidebar-sm"
        header={editCEvoSideBarHeader}
      >
        <PortfolioCompoundEvolutionEdit
          existingCEvo={selectedCEvo}
          closeSideBar={() => setDisplayEditCEvoSideBar(false)}
        />
      </Sidebar>
    </div>
  );
};

export default observer(PortfolioCompoundEvolution);
