import { Dropdown } from "primereact/dropdown";
import React, { useContext } from "react";
import { FcDataSheet, FcNeutralTrading, FcOk, FcPlanner } from "react-icons/fc";
import { GiVote } from "react-icons/gi";
import { RootStoreContext } from "../../stores/rootStore";
import "./ScreenStatus.css";

const ScreenStatus = ({ status }) => {
  const rootStore = useContext(RootStoreContext);
  const { appVars } = rootStore.generalStore;

  let indexMap = {
    Planned: 0,
    "Assay Development": 1,
    Ongoing: 2,
    "Voting Ready": 3,
    Completed: 4,
  };

  const optionsWithIcons = [
    { name: "Planned", icon: <FcPlanner /> },
    { name: "Assay Development", icon: <FcDataSheet /> },
    { name: "Ongoing", icon: <FcNeutralTrading /> },
    { name: "Voting Ready", icon: <GiVote /> },
    { name: "Completed", icon: <FcOk /> },
  ];

  const selectedItemTemplate = (option) => {
    if (option) {
      return (
        <div className="flex align-items-center gap-2">
          <div className="flex flex-column">{option.icon}</div>
          <div className="flex flex-column">{option.name}</div>
        </div>
      );
    }
  };

  return (
    <div className="flex">
      <Dropdown
        value="Planned"
        optionLabel="name"
        optionValue="name"
        options={optionsWithIcons}
        placeholder="Set Status"
        itemTemplate={selectedItemTemplate}
        valueTemplate={selectedItemTemplate}
      />
    </div>
  );
};

export default ScreenStatus;
