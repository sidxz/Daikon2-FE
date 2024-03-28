import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { Divider } from "primereact/divider";
import { Sidebar } from "primereact/sidebar";
import { Tag } from "primereact/tag";
import React, { useContext, useState } from "react";
import FDate from "../../../../../Library/FDate/FDate";
import PleaseWait from "../../../../../Library/PleaseWait/PleaseWait";
import SmilesView from "../../../../../Library/SmilesView/SmilesView";
import { RootStoreContext } from "../../../../../RootStore";
import HaCompoundEvolutionAdd from "./components/HaCompoundEvolutionAdd";
import HaCompoundEvolutionMenuBar from "./components/HaCompoundEvolutionMenuBar";
const HaCompoundEvolution = () => {
  const rootStore = useContext(RootStoreContext);
  const { selectedHa, isFetchingHa } = rootStore.haStore;

  const [displayAddCEvoSideBar, setDisplayAddCEvoSideBar] = useState(false);
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);

  if (isFetchingHa) {
    return <PleaseWait />;
  }

  const addCEvoSideBarHeader = (
    <div className="flex align-items-center gap-2">
      <i className="icon icon-common icon-plus-circle"></i>
      <span className="font-bold">Add Compound Evolution</span>
    </div>
  );

  return (
    <div className="flex flex-column p-align-center w-full">
      <div className="flex ">
        <HaCompoundEvolutionMenuBar
          setDisplayAddCEvoSideBar={setDisplayAddCEvoSideBar}
        />
      </div>
      <div className="flex flex-wrap">
        {selectedHa?.haCompoundEvolution?.map((event, index) => (
          <div key={event} className="flex">
            <div className="flex flex-column mb-4">
              <div className="flex">
                <Divider align="left" type="dashed">
                  <div className="flex gap-1">
                    <div className="flex">
                      <Tag value={event?.stage} />
                    </div>
                    <div className="flex">
                      <Chip
                        label={<FDate timestamp={event?.evolutionDate} />}
                      />
                    </div>
                    <div className="flex align-items-center">
                      <i className="pi pi-arrow-left text-xs text-200" />
                    </div>
                    <div className="flex align-items-center text-sm text-500">
                      {index == 0 ? "(Latest)" : ""}
                      {index == selectedHa?.haCompoundEvolution.length - 1
                        ? "(Initial)"
                        : ""}
                    </div>
                  </div>
                </Divider>
              </div>
              <div
                className="flex flex-column pl-4 pr-4 border-1 border-50 border-round-md	mr-2"
                style={{ position: "relative" }}
              >
                <div
                  className="flex p-2"
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
                    //onClick={() => setIsNotesExpanded(!isNotesExpanded)}
                  />
                </div>
                <div className="flex align-items-center justify-content-center">
                  <SmilesView
                    smiles={event?.molecule?.smiles}
                    width={300}
                    height={300}
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex border-1 border-50 pr-2 pl-2">
                    {event?.molecule?.name}
                  </div>
                  <div className="flex border-1 border-50 pr-2 pl-2">
                    IC50: {event?.iC50} (µM)
                  </div>
                  <div className="flex border-1 border-50 pr-2 pl-2">
                    MIC: {event?.mic} (µM)
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex border-1 border-50 pr-2 pl-2">
                    Mol Weight: {event?.molecule?.molecularWeight}
                  </div>
                  <div className="flex border-1 border-50 pr-2 pl-2">
                    TPSA: {event?.molecule?.tpsa}
                  </div>
                </div>
                <div className="flex gap-2 pr-2 pl-2 border-1 border-50 pb-1 align-items-center">
                  <div className="flex" style={{ width: "200px" }}>
                    Notes :{" "}
                    {event?.notes?.length > 20 && !isNotesExpanded
                      ? event?.notes?.substring(0, 20) + "..."
                      : event?.notes}
                  </div>
                  {event?.notes?.length > 20 && (
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
        <HaCompoundEvolutionAdd
          hitAssessmentId={selectedHa?.id}
          closeSideBar={() => setDisplayAddCEvoSideBar(false)}
        />
      </Sidebar>
    </div>
  );
};

export default observer(HaCompoundEvolution);
