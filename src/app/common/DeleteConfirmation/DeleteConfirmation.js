import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { useState } from "react";

const DeleteConfirmation = ({
  message = "Please acknowledge your decision to erase this data.",
  cnfText = "delete",
  loading = false,
  callBack,
}) => {
  const [termTextValue, setTermTextValue] = useState("");
  const [activateTerminateButton, setActivateTerminateButton] = useState(false);

  var check = (val) => {
    setTermTextValue(val);
    if (val.toLowerCase() === cnfText.toLowerCase()) {
      setActivateTerminateButton(true);
    } else {
      setActivateTerminateButton(false);
    }
  };

  return (
    <div className="flex flex-column gap-2 p-2 w-full">
      <div className="flex text-xl">{message}</div>
      <div className="flex font-medium">
        Type '<b>{cnfText}</b>' to confirm.
      </div>
      <div className="formgroup">
        <div className="field w-full">
          <InputText
            className="w-full"
            value={termTextValue}
            onChange={(e) => check(e.target.value)}
          />
        </div>
        <div className="field">
          <Button
            label="Delete"
            className="p-button-outlined p-button-danger"
            disabled={!activateTerminateButton}
            loading={loading}
            icon="icon icon-common icon-minus-circle"
            onClick={() => callBack()}
          />
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
