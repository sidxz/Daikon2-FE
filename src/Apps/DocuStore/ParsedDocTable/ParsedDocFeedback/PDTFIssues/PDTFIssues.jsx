import { observer } from "mobx-react-lite";
import { Divider } from "primereact/divider";
import { InputTextarea } from "primereact/inputtextarea";
import React from "react";

const PDTFIssues = () => {
  return (
    <div className="flex flex-column w-full surface-ground ml-4 p-1 border-round-md">
      <div className="flex flex-column">
        <div className="flex font-bold capitalize text-lg pt-2 pl-2">
          Feedbacks
        </div>
      </div>
      <div className="flex flex-column">
        <Divider />
      </div>
      <div className="flex flex-column">
        <div className="flex border-0">
          <InputTextarea
            rows={5}
            //cols={30}
            autoResize
            placeholder="Enter your comment"
          />
        </div>
      </div>
    </div>
  );
};
export default observer(PDTFIssues);
