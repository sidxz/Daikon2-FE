import { observer } from "mobx-react-lite";
import { Editor } from "primereact/editor";
import React, { useEffect, useState } from "react";

const RichTextEditEditor = ({ data, dataSelector }) => {
  // Ensure the dataSelector and data are valid before initializing state
  const initialDescription =
    data && dataSelector in data ? data[dataSelector] : "";

  // Initialize state
  const [description, setDescription] = useState(initialDescription);

  // Debugging logs for state and props
  useEffect(() => {
    console.debug(
      "RichTextEditEditor -> Initialized description:",
      description
    );
    console.debug("RichTextEditEditor -> Data from props:", data[dataSelector]);
  }, [description, data, dataSelector]);

  // Header toolbar for the editor
  const editorHeaderTemplate = (
    <span className="ql-formats">
      <button className="ql-bold" aria-label="Bold"></button>
      <button className="ql-italic" aria-label="Italic"></button>
      <button className="ql-underline" aria-label="Underline"></button>
      <button className="ql-strike" aria-label="Strike"></button>
      <button className="ql-link" aria-label="Link"></button>
      <button className="ql-list" value="bullet" aria-label="Bullet"></button>
    </span>
  );

  // Handle text change event
  const handleTextChange = (e) => {
    const updatedDescription = e.htmlValue;

    if (typeof updatedDescription === "string") {
      setDescription(updatedDescription);

      // Safely update the external data object
      if (data && dataSelector in data) {
        data[dataSelector] = updatedDescription;
      } else {
        console.warn("Invalid data or dataSelector provided. Update skipped.");
      }
    } else {
      console.error("Invalid HTML value received from the editor.");
    }
  };

  return (
    <div className="flex text-base border-2 w-full">
      <Editor
        className="w-full"
        style={{ height: "320px" }}
        headerTemplate={editorHeaderTemplate}
        value={description}
        onTextChange={handleTextChange}
      />
    </div>
  );
};

export default observer(RichTextEditEditor);
