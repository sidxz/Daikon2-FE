import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import EmbeddedHelp from "../../../../../app/common/EmbeddedHelp/EmbeddedHelp";
import { RootStoreContext } from "../../../../../app/stores/rootStore";

const ScreenMerge = ({ screens, close }) => {
  const [screen1Id, setscreen1Id] = useState("");
  const [screen2Id, setscreen2Id] = useState("");
  const [confirm, setConfirm] = useState("");

  const rootStore = useContext(RootStoreContext);
  const { isMergingScreen, mergeScreen } = rootStore.screenTStore;

  let dataOnSubmitValidate = () => {
    let screen1 = screens.find(({ id }) => id === screen1Id);
    let screen2 = screens.find(({ id }) => id === screen2Id);

    if (screen1.orgId !== screen2.orgId) {
      toast.error("Cannot merge screens from different orgs.");
      return;
    }
    if (screen1.method !== screen2.method) {
      toast.error("Cannot merge screens with different screening methods.");
      return;
    }

    mergeScreen({
      firstScreenId: screen1Id,
      mergeScreenId: screen2Id,
    }).then((res) => {
      if (res !== null) {
        close();
        window.location.reload();
      }
    });
  };

  return (
    <div className="card">
      <EmbeddedHelp>
        <div>
          Please make sure that both screening efforts :
          <ul>
            <li>
              belong to the <b>same organization.</b>
            </li>
            <li>
              have same <b>screening method.</b>
            </li>
          </ul>
        </div>
      </EmbeddedHelp>

      <div className="flex flex-column">
        <div className="flex flex-row gap-4 h-2rem align-content-center">
          <div className="flex gap-4 align-content-center align-items-center">
            <h4>Select Screen:</h4>
            <Dropdown
              optionLabel="screenName"
              optionValue="id"
              value={screen1Id}
              options={screens}
              onChange={(e) => setscreen1Id(e.value)}
              placeholder="Select Primary Screen"
            />
          </div>
          <div className="flex gap-4 align-items-center">
            <h4> &lt;- Merge:</h4>
            <Dropdown
              optionLabel="screenName"
              optionValue="id"
              value={screen2Id}
              options={screens.filter((s) => s.id !== screen1Id)}
              onChange={(e) => setscreen2Id(e.value)}
              placeholder="Select Screen that will be merged"
            />
          </div>
        </div>
        <br />
        <div className="flex flex-row gap-4 h-2rem align-content-center">
          <div className="flex gap-4 align-content-center align-items-center">
            Type 'MERGE' to Confirm
            <InputText
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-max"
            />
          </div>
          <div className="flex gap-4 align-content-center align-items-center">
            <Button
              label="Merge Screens"
              className="p-button-success"
              disabled={confirm !== "MERGE"}
              loading={isMergingScreen}
              onClick={() => dataOnSubmitValidate()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default observer(ScreenMerge);
