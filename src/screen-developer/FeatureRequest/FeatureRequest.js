import { Button } from "primereact/button";
import { Editor } from "primereact/editor";
import React, { useState } from "react";
import { toast } from "react-toastify";
import EmbeddedHelp from "../../app/common/EmbeddedHelp/EmbeddedHelp";

const FeatureRequest = () => {
  let prefilledText = `<b>1. Feature Description</b><br /><br />
    [Enter details here*]
    <br />
    <br />
    <b>2. How do you think this would benefit the community?</b><br /><br />
    [Enter details here]
    <br />
    <br />
    <b>3. Additional details.</b><br /><br />
    [Enter details here]
  `;
  const [description, setDescription] = useState(prefilledText);

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

  let copyTemplate = () => {
    navigator.clipboard.writeText(description);
    toast.success(
      "Copied text to clipboard. Now please visit GitHub to record the request."
    );
  };

  return (
    <div className="flex w-full flex-column pl-6">
      <h2>Feature Request</h2>
      <EmbeddedHelp>
        Thank you for your time! Feedbacks helps us improve.
      </EmbeddedHelp>
      <EmbeddedHelp>
        Feature Requests are maintained in github and are <b>&nbsp; public</b>.
        Make sure you <b>&nbsp; do NOT have any sensitive data &nbsp;</b> placed
        in the submission.
      </EmbeddedHelp>
      <p>
        - Please use this template to request a new feature.
        <br />- click on 'COPY Text' button to copy the filled template.
        <br />- Click on 'Open GitHub Issues Page' give a title, paste the
        content to comments, and click 'create an issue'.
        <br />- Or to contact our team directly, please email us at
        <b> sid@tamu.edu</b>,<b> panda@tamu.edu</b>,
        <b> steve.berthel@panoramaglobal.org</b> and paste the content to the
        email.
      </p>
      <div className="flex">
        <div className="flex pr-2 pb-2">
          <Button
            label="COPY Text"
            className="p-button-secondary"
            onClick={() => copyTemplate()}
          />
        </div>
        <div className="flex pr-2 pb-2">
          <Button
            label="Open GitHub Issues Page"
            className="p-button-secondary"
            onClick={() =>
              window.open(
                "https://github.com/saclab/daikon-core-webapp/issues/new",
                "_blank",
                "noreferrer"
              )
            }
          />
        </div>
      </div>
      <Editor
        style={{ height: "25rem", width: "100%" }}
        headerTemplate={headerOfTextEditor}
        value={description}
        onTextChange={(e) => {
          setDescription(e.htmlValue);
        }}
      />
    </div>
  );
};

export default FeatureRequest;
