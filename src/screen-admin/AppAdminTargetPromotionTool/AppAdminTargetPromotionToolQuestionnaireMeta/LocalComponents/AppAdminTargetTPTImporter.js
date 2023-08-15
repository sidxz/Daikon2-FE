import * as jsYaml from "js-yaml";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { ProgressBar } from "primereact/progressbar";
import { Tooltip } from "primereact/tooltip";
import React, { useContext, useRef } from "react";
import { toast } from "react-toastify";
import { RootStoreContext } from "../../../../app/stores/rootStore";

const AppAdminTargetTPTImporter = ({ closeImportDialog }) => {
  const rootStore = useContext(RootStoreContext);
  const {
    fetchQuestions,
    questions,
    isFetchingQuestions,
    isEditingQuestions,
    addOrEditQuestions,
  } = rootStore.targetPTQuestionnaireMetaStore;

  const fileUploadRef = useRef(null);

  const onTemplateUpload = (event) => {
    //console.log("onTemplateUpload");
    const files = event.files;
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const parsedYaml = jsYaml.load(e.target.result);
        //console.log(parsedYaml);
        addOrEditQuestions(parsedYaml.Data);
        closeImportDialog();
      } catch (error) {
        toast.error("Error parsing YAML file");
      }
    };

    reader.readAsText(files[0]);
  };

  const headerTemplate = (options) => {
    const { className, chooseButton, uploadButton, cancelButton } = options;
    return (
      <div
        className={className}
        style={{
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
        }}
      >
        {chooseButton}
        {uploadButton}
        {cancelButton}
      </div>
    );
  };

  const itemTemplate = (file) => {
    return (
      <div className="flex align-items-center flex-wrap">
        <span className="flex flex-column text-left ml-3">
          {file.name}
          <small>{new Date().toLocaleDateString()}</small>
        </span>
        <Button
          type="button"
          icon="pi pi-times"
          className="p-button-outlined p-button-rounded p-button-danger ml-auto"
          onClick={() => fileUploadRef.current.removeFile(file)}
        />
      </div>
    );
  };

  const emptyTemplate = () => {
    return (
      <div className="flex align-items-center flex-column">
        <i
          className="pi pi-file-o mt-3 p-5"
          style={{
            fontSize: "5em",
            borderRadius: "50%",
            backgroundColor: "var(--surface-b)",
            color: "var(--surface-d)",
          }}
        ></i>
        <span
          style={{ fontSize: "1.2em", color: "var(--text-color-secondary)" }}
          className="my-5"
        >
          Drag and Drop YAML File Here
        </span>
      </div>
    );
  };

  const chooseOptions = {
    icon: "pi pi-fw pi-file-o",
    iconOnly: true,
    className: "custom-choose-btn p-button-rounded p-button-outlined",
  };
  const uploadOptions = {
    icon: "pi pi-fw pi-cloud-upload",
    iconOnly: true,
    className:
      "custom-upload-btn p-button-success p-button-rounded p-button-outlined",
  };
  const cancelOptions = {
    icon: "pi pi-fw pi-times",
    iconOnly: true,
    className:
      "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined",
  };

  if (isEditingQuestions) {
    return (
      <div
        className="flex w-full"
        style={{
          minHeight: "25rem",
        }}
      >
        <div className="flex w-full">
          <ProgressBar
            mode="indeterminate"
            className="w-full"
            style={{ height: "10rem" }}
          ></ProgressBar>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex w-full"
      style={{
        minHeight: "25rem",
      }}
    >
      <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
      <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
      <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

      <FileUpload
        ref={fileUploadRef}
        className="w-full"
        name="demo[]"
        accept=".yaml"
        maxFileSize={1000000}
        customUpload={true}
        uploadHandler={onTemplateUpload}
        headerTemplate={headerTemplate}
        itemTemplate={itemTemplate}
        emptyTemplate={emptyTemplate}
        chooseOptions={chooseOptions}
        uploadOptions={uploadOptions}
        cancelOptions={cancelOptions}
      />
    </div>
  );
};

export default observer(AppAdminTargetTPTImporter);
