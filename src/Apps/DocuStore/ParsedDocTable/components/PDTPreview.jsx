import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { DVariableResolver } from "../../../../Shared/DVariable/DVariableResolver";
import MLTags from "../../../../Shared/TagGenerators/MLTags/MLTags";
import { Rating } from "primereact/rating";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Divider } from "primereact/divider";
import { Dialog } from "primereact/dialog";

const PDTPreview = ({ rowData }) => {
  const [value, setValue] = useState(null);
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-column gap-1">
      <div className="flex align-content-center">
        <div className="flex font-bold capitalize surface-ground p-1 border-round-md">
          {DVariableResolver(rowData?.title)}
        </div>
        {rowData?.authors?.value?.length > 0 && (
          <div className="flex text-blue-700 p-1">
            | {DVariableResolver(rowData?.authors)}
          </div>
        )}
      </div>
      {DVariableResolver(rowData?.shortSummary) === null && (
        <div className="flex text-justify	line-height-3 select-text">
          Preview is not available.
        </div>
      )}
      <div className="flex text-justify	line-height-3 select-text">
        {DVariableResolver(rowData?.shortSummary)?.replace(/\*/g, " ")}
      </div>
      {rowData?.shortSummary?.value?.length > 0 && (
        <div className="flex border-0">
          <MLTags entity={rowData?.shortSummary} />
        </div>
      )}
      <div className="flex m-1 p-1 mt-4 mb-0">
        <div className="flex flex-column text-xs">
          <span className="text-gray-600 pb-2">Relevance</span>
          <Rating
            value={value}
            onChange={(e) => setValue(e.value)}
            cancel={false}
          />
        </div>
        <div className="flex flex-column text-xs ml-5">
          <span className="text-gray-600 pb-2">Accuracy</span>
          <Rating
            value={value}
            onChange={(e) => setValue(e.value)}
            cancel={false}
          />
        </div>
        <div className="flex flex-column ml-3 mt-3 p-0">
          <Button
            icon="pi pi-comment"
            label="4"
            className="p-button-text p-button-sm"
            text
            onClick={() => setVisible(true)}
          />
          <Dialog
            header="Summary Preview"
            visible={visible}
            maximizable
            style={{ width: "50vw" }}
            onHide={() => {
              if (!visible) return;
              setVisible(false);
            }}
          >
            <p className="m-0">
              <div className="flex text-justify	line-height-3 select-text">
                {DVariableResolver(rowData?.shortSummary)?.replace(/\*/g, " ")}
              </div>
              {rowData?.shortSummary?.value?.length > 0 && (
                <div className="flex border-0">
                  <MLTags entity={rowData?.shortSummary} />
                </div>
              )}{" "}
            </p>
          </Dialog>
        </div>
        <div className="flex flex-column ml-3 mt-3 p-0">
          <Button
            label="2"
            icon="pi pi-exclamation-triangle"
            className="p-button-text p-button-sm"
            text
            onClick={() => setVisible(true)}
          />
          <Dialog
            header="Summary Preview"
            visible={visible}
            maximizable
            style={{ width: "50vw" }}
            onHide={() => {
              if (!visible) return;
              setVisible(false);
            }}
          >
            <p className="m-0">
              <div className="flex text-justify	line-height-3 select-text">
                {DVariableResolver(rowData?.shortSummary)?.replace(/\*/g, " ")}
              </div>
              {rowData?.shortSummary?.value?.length > 0 && (
                <div className="flex border-0">
                  <MLTags entity={rowData?.shortSummary} />
                </div>
              )}{" "}
            </p>
          </Dialog>
        </div>

        <div className="flex flex-column ml-3 mt-3 p-0">
          <Button
            
            label="+ New Comment"
            className="p-button-text p-button-sm"
            text
            onClick={() => setVisible(true)}
          />
          <Dialog
            header="Summary Preview"
            visible={visible}
            maximizable
            style={{ width: "50vw" }}
            onHide={() => {
              if (!visible) return;
              setVisible(false);
            }}
          >
            <p className="m-0">
              <div className="flex text-justify	line-height-3 select-text">
                {DVariableResolver(rowData?.shortSummary)?.replace(/\*/g, " ")}
              </div>
              {rowData?.shortSummary?.value?.length > 0 && (
                <div className="flex border-0">
                  <MLTags entity={rowData?.shortSummary} />
                </div>
              )}{" "}
            </p>
          </Dialog>
        </div>

        <div className="flex flex-column ml-3 mt-3 p-0">
          <Button
            
            label="+ New Issue"
            className="p-button-text p-button-sm"
            text
            onClick={() => setVisible(true)}
          />
          <Dialog
            header="Summary Preview"
            visible={visible}
            maximizable
            style={{ width: "50vw" }}
            onHide={() => {
              if (!visible) return;
              setVisible(false);
            }}
          >
            <p className="m-0">
              <div className="flex text-justify	line-height-3 select-text">
                {DVariableResolver(rowData?.shortSummary)?.replace(/\*/g, " ")}
              </div>
              {rowData?.shortSummary?.value?.length > 0 && (
                <div className="flex border-0">
                  <MLTags entity={rowData?.shortSummary} />
                </div>
              )}{" "}
            </p>
          </Dialog>
        </div>
      </div>
      <Divider className="mt-0" />
    </div>
  );
};

export default observer(PDTPreview);
