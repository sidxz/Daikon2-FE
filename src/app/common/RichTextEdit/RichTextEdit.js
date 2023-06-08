import _ from "lodash";
import { ContextMenu } from "primereact/contextmenu";
import React, { useRef, useState } from "react";
import { StartCase } from "react-lodash";

import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import RichTextDisplay from "./RichTextDisplay/RichTextDisplay";
import RichTextEditEditor from "./RichTextEditEditor/RichTextEditEditor";

const RichTextEdit = ({ data, dataSelector, editFunc, cancelEdit }) => {
  const cm = useRef(null);
  const [displayEditContainer, setDisplayEditContainer] = useState(false);

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

  // check if dataSelector is not found in data object
  if (!data[dataSelector]) {
    console.error("RichTextEdit dataSelector not found in data object");
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
    <div onContextMenu={(e) => cm.current.show(e)}>
      <RichTextDisplay data={data[dataSelector]} />
      <ContextMenu model={contextMenuItems} ref={cm}></ContextMenu>

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
          dataSelector={"background"}
          editFunc={editFunc}
          cancelEdit={cancelEdit}
        />
      </Dialog>
    </div>
  );
};

export default RichTextEdit;
