import { Button } from "primereact/button";
import { Chips } from "primereact/chips";
import { Editor } from "primereact/editor";
import { InputText } from "primereact/inputtext";

import React, { useState } from "react";

const StartDiscussion = ({
  section,
  reference,
  newDiscussion,
  postingDiscussion,
  tagsFilters = [],
  close,
}) => {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([...tagsFilters]);

  let submitNewDiscussion = () => {
    let formatedDiscussion = {
      reference: reference,
      section: section,
      topic: topic,
      description: description,
      mentions: [],
      tags: [...tags],
    };

    newDiscussion(formatedDiscussion).then((res) => {
      if (res !== null) close();
    });
  };

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
    <div className="flex flex-column w-full">
      <div className="card">
        <h3>(Topic) What is it about?</h3>
        <InputText
          value={topic}
          placeholder="A one line summary of the question/discussion."
          onChange={(e) => setTopic(e.target.value)}
          style={{ width: "100%" }}
          readOnly={postingDiscussion}
        />

        <h3>Description</h3>
        <p>Include detailed information that is relevant to the topic.</p>
        <Editor
          style={{ height: "200px" }}
          headerTemplate={headerOfTextEditor}
          value={description}
          onTextChange={(e) => {
            setDescription(e.htmlValue);
          }}
          readOnly={postingDiscussion}
        />

        {/* <h3>Tag Users?</h3>
        <Mention
          suggestions={suggestions}
          onSearch={onSearch}
          field="name"
          placeholder="Please enter @ to mention people if you think they are related. We will send them an email!"
          rows={4}
          style={{ width: "100%" }}
          itemTemplate={itemTemplate}
        /> */}
        <br />
        <Chips
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          separator=","
          placeholder="Add tags if required"
          allowDuplicate={false}
        ></Chips>

        <br />
        <br />

        <Button
          label="Post"
          icon="pi pi-comment"
          style={{
            background: "#28477f",
            border: "0px solid #28477f",
            width: "100%",
          }}
          loading={postingDiscussion}
          onClick={() => submitNewDiscussion()}
        />
      </div>
    </div>
  );
};

export default StartDiscussion;
