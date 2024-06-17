import _, { startCase } from "lodash";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { ContextMenu } from "primereact/contextmenu";
import { Dialog } from "primereact/dialog";
import { Sidebar } from "primereact/sidebar";
import React, { useEffect, useRef, useState } from "react";
import RichTextDisplay from "./RichTextDisplay/RichTextDisplay";
import RichTextEditEditor from "./RichTextEditEditor/RichTextEditEditor";
import RichTextEditHistory from "./RichTextEditHistory/RichTextEditHistory";

const RichTextEdit = ({
  baseData,
  dataSelector,
  onSave,
  fetchHistory,
  historyDisplayLoading,
  history,
}) => {
  const cm = useRef(null);
  const [displayEditContainer, setDisplayEditContainer] = useState(false);
  const [displayHistorySideBar, setDisplayHistorySideBar] = useState(false);
  const [fetchHistoryCalled, setFetchHistoryCalled] = useState(false);
  const [data, setData] = useState({ ...baseData });

  useEffect(() => {
    setData({ ...baseData });
  }, [baseData]);

  // console.log("RichTextEdit -> dataSelector", dataSelector);
  // console.log("RichTextEdit -> baseData", baseData);
  // console.log("RichTextEdit -> data", data);

  // check if data is null
  if (!data) {
    console.error("RichTextEdit data is null");
    return <div></div>;
  }

  // check if dataSelector is null
  if (!dataSelector) {
    console.error("RichTextEdit dataSelector is null");
    return <div></div>;
  }

  let cancelEdit = () => {
    setData({ ...baseData });
  };

  /* * * * * * *
  /* * * Begin construction context menu
  */
  const contextMenuItems = [];

  if (_.isFunction(onSave)) {
    contextMenuItems.push({
      label: "Edit",
      icon: "pi pi-tablet",
      command: () => setDisplayEditContainer(true),
    });
    contextMenuItems.push({
      separator: true,
    });
  }

  if (_.isFunction(fetchHistory)) {
    contextMenuItems.push({
      label: "Fetch History",
      icon: "icon icon-common icon-history",
      command: () => {
        setDisplayHistorySideBar(true);
      },
    });
    contextMenuItems.push({
      separator: true,
    });
  }

  contextMenuItems.push({
    label: "Copy",
    icon: "pi pi-copy",
    //command: () => _command_contextMenuCopyCommand(selectedId, toast),
  });

  const editDialogHeader = (
    <>
      <i className="icon icon-common icon-database"></i> &nbsp;
      {startCase(dataSelector)}
    </>
  );

  const editDialogFooter = (
    <div>
      <h3>Save changes to database?</h3>
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={() => {
          cancelEdit();
          setDisplayEditContainer(false);
        }}
        className="p-button-text"
      />
      <Button
        label="Save"
        icon="icon icon-common icon-database-submit"
        onClick={() => {
          onSave(data);
          setDisplayEditContainer(false);
        }}
      />
    </div>
  );

  return (
    <div
      onContextMenu={(e) => cm.current.show(e)}
      className="flex flex-wrap w-full h-full"
    >
      <RichTextDisplay data={baseData[dataSelector]} />
      <ContextMenu model={contextMenuItems} ref={cm}></ContextMenu>

      {/* Edit Dialog */}
      <Dialog
        header={editDialogHeader}
        visible={displayEditContainer}
        closable={true}
        draggable={true}
        style={{ width: "50vw" }}
        onHide={() => setDisplayEditContainer(false)}
        footer={editDialogFooter}
      >
        <RichTextEditEditor
          data={data}
          dataSelector={dataSelector}
          onSave={onSave}
          cancelEdit={cancelEdit}
        />
      </Dialog>

      {/* History Sidebar */}
      <Sidebar
        visible={displayHistorySideBar}
        position="right"
        style={{ width: "50%", overflowX: "auto" }}
        onHide={() => setDisplayHistorySideBar(false)}
        icons={() => (
          <div>
            <i className="icon icon-common icon-history"></i> History
          </div>
        )}
      >
        <div style={{ margin: "15px" }}>
          <h2>{startCase(dataSelector)}</h2>
          <RichTextEditHistory
            fetchHistory={fetchHistory}
            historyDisplayLoading={historyDisplayLoading}
            history={history}
            dataSelector={dataSelector}
          />
        </div>
      </Sidebar>
    </div>
  );
};

export default observer(RichTextEdit);
