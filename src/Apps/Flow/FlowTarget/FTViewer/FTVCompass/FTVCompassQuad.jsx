import { observer } from "mobx-react-lite";
import { BlockUI } from "primereact/blockui";
import { ScrollPanel } from "primereact/scrollpanel";
import React, { useContext } from "react";
import Loading from "../../../../../Library/Loading/Loading";
import RichTextEdit from "../../../../../Library/RichTextEdit/RichTextEdit";
import { RootStoreContext } from "../../../../../RootStore";
import "./FTVCompassQuad.css";

const FTVCompassQuad = () => {
  const rootStore = useContext(RootStoreContext);

  const {
    fetchTarget,
    selectedTarget,
    isFetchingTarget,
    isTargetRegistryCacheValid,
    isUpdatingTarget,
    updateTarget,
  } = rootStore.targetStore;

  if (isFetchingTarget) {
    return <Loading message={"Fetching Target..."} />;
  }

  return (
    <div className="flex flex-column w-full">
      <BlockUI blocked={isUpdatingTarget}>
        <div className="flex w-full">
          <div
            className="flex flex-column w-6 border-1 border-50 border-round-md m-1 p-1"
            style={{
              backgroundColor: "#F0F4F8",
            }}
          >
            <div className="flex justify-content-center text-xl font-semibold border-bottom-1 border-50 p-1">
              <span style={{ margin: 0, padding: 0 }}>Background</span>
            </div>
            <div className="flex">
              <ScrollPanel style={{ width: "100%", height: "250px" }}>
                <RichTextEdit
                  baseData={selectedTarget}
                  dataSelector={"background"}
                  onSave={updateTarget}
                />
              </ScrollPanel>
            </div>
          </div>
          <div
            className="flex flex-column w-6 border-1 border-50 border-round-md m-1 p-1"
            style={{
              backgroundColor: "#D7E9EF",
            }}
          >
            <div className="flex justify-content-center text-xl font-semibold border-bottom-1 border-50 p-1">
              <span style={{ margin: 0, padding: 0 }}>Enablement</span>
            </div>
            <div className="flex">
              <ScrollPanel style={{ width: "100%", height: "250px" }}>
                <RichTextEdit
                  baseData={selectedTarget}
                  dataSelector={"enablement"}
                  onSave={updateTarget}
                />
              </ScrollPanel>
            </div>
          </div>
        </div>
        <div className="flex w-full">
          <div
            className="flex flex-column w-6 border-1 border-50 border-round-md m-1 p-1"
            style={{
              backgroundColor: "#E2DFF0",
            }}
          >
            <div className="flex justify-content-center text-xl font-semibold border-bottom-1 border-50 p-1">
              <span style={{ margin: 0, padding: 0 }}>Strategy</span>
            </div>
            <div className="flex">
              <ScrollPanel style={{ width: "100%", height: "250px" }}>
                <RichTextEdit
                  baseData={selectedTarget}
                  dataSelector={"strategy"}
                  onSave={updateTarget}
                />
              </ScrollPanel>
            </div>
          </div>
          <div
            className="flex flex-column w-6 border-1 border-50 border-round-md m-1 p-1"
            style={{
              backgroundColor: "#F9E5DD",
            }}
          >
            <div className="flex justify-content-center text-xl font-semibold border-bottom-1 border-50 p-1">
              <span style={{ margin: 0, padding: 0 }}>Challenges</span>
            </div>
            <div className="flex">
              <ScrollPanel style={{ width: "100%", height: "250px" }}>
                <RichTextEdit
                  baseData={selectedTarget}
                  dataSelector={"challenges"}
                  onSave={updateTarget}
                />
              </ScrollPanel>
            </div>
          </div>
        </div>
      </BlockUI>
    </div>
  );
};

export default observer(FTVCompassQuad);
