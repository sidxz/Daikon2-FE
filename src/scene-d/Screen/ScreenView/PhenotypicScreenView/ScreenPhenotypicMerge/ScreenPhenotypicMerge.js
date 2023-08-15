import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import EmbeddedHelp from "../../../../../app/common/EmbeddedHelp/EmbeddedHelp";
import PleaseWait from "../../../../../app/common/PleaseWait/PleaseWait";
import SectionHeading from "../../../../../app/common/SectionHeading/SectionHeading";
import { RootStoreContext } from "../../../../../app/stores/rootStore";
import { appColors } from "../../../../../colors";

const ScreenPhenotypicMerge = ({ screenId }) => {
  /* MobX Store */
  const rootStore = useContext(RootStoreContext);
  const { appVars } = rootStore.generalStore;
  const { fetchOrgs, Orgs } = rootStore.adminStore;
  const {
    isLoadingPhenotypicScreen,
    fetchPhenotypicScreen,
    selectedPhenotypicScreen,
    fetchPhenotypicScreens,
    isLoadingPhenotypicScreens,
    phenotypicScreens,
    mergePhenotypicScreen,
    isMergingPhenotypicScreen,
  } = rootStore.screenPStore;

  const navigate = useNavigate();
  const [screen2Id, setScreen2Id] = useState("");
  const [confirm, setConfirm] = useState("");

  // Fetch the phenotypic screen data on component mount or when screenId changes
  useEffect(() => {
    if (phenotypicScreens.length === 0) fetchPhenotypicScreens();
    if (
      selectedPhenotypicScreen === null ||
      selectedPhenotypicScreen.id !== screenId
    ) {
      fetchPhenotypicScreen(screenId);
    }
    if (Orgs.length === 0) fetchOrgs();
  }, [
    selectedPhenotypicScreen,
    fetchPhenotypicScreen,
    screenId,
    Orgs,
    fetchOrgs,
  ]);

  // Display a loading message while data is being fetched
  if (
    isLoadingPhenotypicScreens ||
    isLoadingPhenotypicScreen ||
    selectedPhenotypicScreen === null
  ) {
    return <PleaseWait />;
  }

  // console.log(
  //   "ScreenPhenotypicEdit.js: selectedPhenotypicScreen: ",
  //   selectedPhenotypicScreen
  // );

  const breadCrumbItems = [
    {
      label: "Screens",
      command: () => {
        navigate("/d/screen/");
      },
    },
    {
      label: selectedPhenotypicScreen.screenName,
      command: () => {
        navigate("/d/screen/phenotypic/" + selectedPhenotypicScreen.id);
      },
    },
    {
      label: "Merge",
    },
  ];

  let dataOnSubmitValidate = () => {
    let screen2 = phenotypicScreens.find(({ id }) => id === screen2Id);

    if (selectedPhenotypicScreen.orgId !== screen2.orgId) {
      toast.error("Cannot merge screens from different orgs.");
      return;
    }
    if (selectedPhenotypicScreen.method !== screen2.method) {
      toast.error("Cannot merge screens with different screening methods.");
      return;
    }

    let dto = {
      FirstScreenId: selectedPhenotypicScreen.id,
      MergeScreenId: screen2.id,
    };

    //console.log("ScreenPhenotypicMerge.js: MERGE: ", dto);
    mergePhenotypicScreen(dto);
  };

  return (
    <div className="flex flex-column w-full">
      <div className="flex w-full pb-2">
        <BreadCrumb model={breadCrumbItems} />
      </div>
      <div className="flex w-full">
        <SectionHeading
          icon="icon icon-common icon-search"
          heading={
            "Screens " + selectedPhenotypicScreen.screenName + " [ Merge ]"
          }
          entryPoint={selectedPhenotypicScreen.screenName}
          displayHorizon={true}
          color={appColors.sectionHeadingBg.screen}
        />
      </div>

      <div className="flex w-full m-2 p-2">
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
                  value={selectedPhenotypicScreen.id}
                  options={phenotypicScreens}
                  disabled={true}
                  placeholder="Select Primary Screen"
                />
              </div>
              <div className="flex gap-4 align-items-center">
                <h4> &lt;- Merge:</h4>
                <Dropdown
                  optionLabel="screenName"
                  optionValue="id"
                  value={screen2Id}
                  options={phenotypicScreens.filter(
                    (s) =>
                      s.id !== selectedPhenotypicScreen.id &&
                      s.orgId === selectedPhenotypicScreen.orgId
                  )}
                  onChange={(e) => setScreen2Id(e.value)}
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
                  loading={isMergingPhenotypicScreen}
                  onClick={() => dataOnSubmitValidate()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(ScreenPhenotypicMerge);
