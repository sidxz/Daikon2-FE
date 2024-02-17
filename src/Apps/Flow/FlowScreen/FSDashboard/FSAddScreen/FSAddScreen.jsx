import { Dropdown } from "primereact/dropdown";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RootStoreContext } from "../../../../../RootStore";
import FSAddScreenPhenotypic from "./FSAddScreenPhenotypic";
import FSAddScreenTargetBased from "./FSAddScreenTargetBased";
const FSAddScreen = ({ closeSideBar }) => {
  const rootStore = useContext(RootStoreContext);
  const navigate = useNavigate();

  const screenTypeOptions = [
    { name: "Target Based", value: "target-based" },
    { name: "Phenotypic", value: "phenotypic" },
  ];

  const [screenType, setScreenType] = useState("target-based");

  return (
    <div className="card w-full">
      <div className="field p-fluid">
        <label htmlFor="screenType">Screen Type</label>
        <Dropdown
          id="screenType"
          value={screenType}
          options={screenTypeOptions}
          onChange={(e) => {
            setScreenType(e.value);
          }}
          placeholder="Select a screenType"
          optionLabel="name"
          autoFocus
          className="text-base text-color surface-overlay"
        />
      </div>
      {screenType === "target-based" && (
        <FSAddScreenTargetBased closeSideBar={() => closeSideBar()} />
      )}
      {screenType === "phenotypic" && (
        <FSAddScreenPhenotypic closeSideBar={() => closeSideBar()} />
      )}
    </div>
  );
};

export default FSAddScreen;
