import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { useState } from "react";

const GeneralConfirmation = ({
  message = "Please acknowledge your decision.",
  cnfText = "confirm",
  loading = false,
  icon = "icon icon-common icon-minus-circle",
  btnClass = "p-button-outlined p-button-danger",
  btnLabel = "Confirm",
  callBack,
}) => {
  const [termTextValue, setTermTextValue] = useState("");
  const [activateButton, setActivateButton] = useState(false);

  var check = (val) => {
    setTermTextValue(val);
    if (val.toLowerCase() === cnfText.toLowerCase()) {
      setActivateButton(true);
    } else {
      setActivateButton(false);
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
            label={btnLabel}
            className={btnClass}
            disabled={!activateButton}
            loading={loading}
            icon={icon}
            onClick={() => callBack()}
          />
        </div>
      </div>
    </div>
  );
};

export default GeneralConfirmation;
