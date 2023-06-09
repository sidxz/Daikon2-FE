import _ from "lodash";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { ContextMenu } from "primereact/contextmenu";
import { Dialog } from "primereact/dialog";
import { Sidebar } from "primereact/sidebar";
import React, { useRef, useState } from "react";
import { StartCase } from "react-lodash";
import RichTextDisplay from "./RichTextDisplay/RichTextDisplay";
import RichTextEditEditor from "./RichTextEditEditor/RichTextEditEditor";
import RichTextEditHistory from "./RichTextEditHistory/RichTextEditHistory";

const RichTextEdit = ({
  data,
  dataSelector,
  editFunc,
  cancelEdit,
  fetchHistory,
  historyDisplayLoading,
  history,
}) => {
  const cm = useRef(null);
  const [displayEditContainer, setDisplayEditContainer] = useState(false);
  const [displayHistorySideBar, setDisplayHistorySideBar] = useState(false);
  const [fetchHistoryCalled, setFetchHistoryCalled] = useState(false);

  // useEffect(() => {
  //   if (
  //     !fetchHistoryCalled &&
  //     (JSON.parse(localStorage.getItem("_local_HighlightAllChanges")) ||
  //       JSON.parse(localStorage.getItem("_local_HighlightRecentChanges")))
  //   ) {
  //     _.isFunction(fetchHistory) && fetchHistory();
  //     setFetchHistoryCalled(true);
  //   }

  //   return () => {};
  // }, [fetchHistory, setFetchHistoryCalled, fetchHistoryCalled]);

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

  /* * * * * * *
  /* * * Begin construction context menu
  */
  const contextMenuItems = [];

  if (_.isFunction(editFunc)) {
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
      <StartCase string={dataSelector} />
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
          editFunc();
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
      <RichTextDisplay data={data[dataSelector]} />
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
          editFunc={editFunc}
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
          <h2>
            <StartCase string={dataSelector} />
          </h2>
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
