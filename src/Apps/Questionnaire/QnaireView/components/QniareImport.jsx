import * as jsYaml from "js-yaml";
import { FileUpload } from "primereact/fileupload";
import React, { useContext } from "react";
import { RootStoreContext } from "../../../../RootStore";
const QniareImport = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    selectedQuestionnaire,
    updateQuestionnaire,
    isUpdatingQuestionnaire,
  } = rootStore.qnaireStore;

  return (
    <>
      <FileUpload
        name="yamlFile"
        accept=".yaml"
        maxFileSize={1000000}
        mode="basic"
        chooseLabel="Import"
        chooseOptions={{
          icon: "icon icon-common icon-plus-circle",
          className: "p-button-text p-button-md",
        }}
        cancelOptions={{
          label: "Cancel",
          icon: "pi pi-times",
          className: "p-button-danger",
        }}
        className="p-button-text p-button-secondary"
        customUpload={true}
        uploadHandler={async (e) => {
          let file = e.files[0];
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const parsedYaml = jsYaml.load(e.target.result);
              //console.log(parsedYaml);
              updateQuestionnaire(parsedYaml);
            } catch (error) {
              toast.error("Error parsing YAML file");
            }
          };
          reader.readAsText(file);
          e.files = null;

          // This is to clear the file list in the FileUpload component
          e.options.clear();

          // jsonData.forEach((row) => {
          //   // row.hitCollectionId = selectedHitCollection.id;
          //   // output is in field 'smiles' in excel (template), but to create a hit, we need 'requestedSMILES'
          //   // row.requestedSMILES = row.smiles;
          // });
          //hideFileUploadDialog();
        }}
        auto
      />
    </>
  );
};

export default QniareImport;
