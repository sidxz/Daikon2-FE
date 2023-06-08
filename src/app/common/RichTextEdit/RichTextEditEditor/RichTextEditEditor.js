import { Editor } from "primereact/editor";
import React, { useState } from "react";

const RichTextEditEditor = ({ data, dataSelector }) => {
  const [description, setDescription] = useState(data[dataSelector]);

  const headerOfTextEditor = (
    <span className="ql-formats">
      <button className="ql-bold" aria-label="Bold"></button>
      <button className="ql-italic" aria-label="Italic"></button>
      <button className="ql-underline" aria-label="Underline"></button>
      <button className="ql-strike" aria-label="Strike"></button>
      <button className="ql-link" aria-label="Link"></button>
      <button className="ql-list" value="bullet" aria-label="Bullet"></button>
    </span>
  );

  return (
    <div>
      <Editor
        style={{ height: "320px" }}
        headerTemplate={headerOfTextEditor}
        value={description}
        onTextChange={(e) => {
          setDescription(e.htmlValue);
          data[dataSelector] = e.htmlValue;
        }}
        //readOnly={postingDiscussion}
      />
    </div>
  );
};

export default RichTextEditEditor;
