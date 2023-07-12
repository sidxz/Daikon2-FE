import { Button } from "primereact/button";
import { Inplace, InplaceContent, InplaceDisplay } from "primereact/inplace";
import React, { useContext, useRef, useState } from "react";

import { Steps } from "primereact/steps";
import { RootStoreContext } from "../../stores/rootStore";
import "./ScreenStatus.css";

const ScreenStatus = ({ status }) => {
  const rootStore = useContext(RootStoreContext);
  const { appVars } = rootStore.generalStore;
  const op = useRef(null);
  const [editActive, setEditActive] = useState(false);

  console.log(appVars);
  const items = [
    ...appVars.screenStatuses.map((s) => {
      return { label: s };
    }),
  ];

  let stepsView = (
    <div className="flex justify-content-end" style={{ minWidth: "600px" }}>
      <div className="flex w-full">
        <Steps model={items} className="w-full gap-2 p-0 m-0" />
      </div>
      <div className="flex">
        <Button
          icon="icon icon-common icon-angle-right"
          onClick={() => setEditActive(!editActive)}
          className="p-button-text p-button-plain m-0"
        ></Button>
      </div>
    </div>
  );

  let chipTemplate = (
    <div>
      {" "}
      <Button
        label={status}
        icon="pi pi-refresh"
        onClick={(e) => op.current.toggle(e)}
        aria-haspopup
        aria-controls="overlay_panel"
        className="p-button-text p-button-sm p-button-plain"
      ></Button>
    </div>
  );

  return (
    <div className="flex">
      <Inplace active={editActive} onToggle={(e) => setEditActive(e.value)}>
        <InplaceDisplay className="m-0">
          <div class="flex fadein animation-duration-1000 ">
            <Button
              label={status}
              icon="icon icon-common icon-angle-left"
              className="p-button-text p-button-plain m-0 p-button-rounded"
            ></Button>
          </div>
        </InplaceDisplay>

        <InplaceContent className="m-0">
          <div class="fadein animation-duration-1000 flex w-full">
            {stepsView}
          </div>
        </InplaceContent>
      </Inplace>
    </div>
  );
};

export default ScreenStatus;
