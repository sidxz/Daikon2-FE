import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Menu } from "primereact/menu";
import { Sidebar } from "primereact/sidebar";
import React, { useContext, useEffect, useRef, useState } from "react";
import SmilesView from "../../../../../../Library/SmilesView/SmilesView";
import { RootStoreContext } from "../../../../../../RootStore";
import { MolecuLogixIcon } from "../../../../../MolecuLogix/Icons/MolecuLogixIcon";
import MLogixRegisterMolecule from "../../../../../MolecuLogix/MLogixAllMolecules/MLogixRegisterMolecule";

const FHaNewMoleculePicker = ({ selectedMolecule, setSelectedMolecule }) => {
  const rootStore = useContext(RootStoreContext);
  const {
    moleculeList,
    fetchMolecules,
    isFetchingMolecules,
    isMoleculeRegistryCacheValid,
  } = rootStore.moleculeStore;

  const sideMenu = useRef(null);
  const [displayAddSideBar, setDisplayAddSideBar] = useState(false);

  useEffect(() => {
    if (!isMoleculeRegistryCacheValid) {
      fetchMolecules();
    }
  }, [isMoleculeRegistryCacheValid, fetchMolecules]);

  let moleculeTemplate = (molecule) => {
    return (
      <div className="flex flex gap-1 border-1 border-50">
        <div className="flex flex-column border-1 border-50">
          <div className="flex  p-2">Name: {molecule?.name}</div>
        </div>
        <div
          className="flex align-items-center justify-content-center"
          style={{ width: "200px", height: "200px" }}
        >
          <SmilesView
            smiles={molecule?.smilesCanonical}
            width={"200"}
            height={"200"}
          />
        </div>
      </div>
    );
  };

  const sideMenuItems = [
    {
      label: "Options",
      items: [
        {
          label: "Register New Molecule",
          icon: <MolecuLogixIcon />,
          command: () => {
            setDisplayAddSideBar(true);
          },
        },
      ],
    },
  ];

  const addSideBarHeader = (
    <div className="flex w-full justify-between items-center">
      <h2 className="text-lg font-semibold">Register Molecule</h2>
    </div>
  );

  return (
    <div className="flex flex w-full gap-2">
      <div className="flex w-full">
        <Dropdown
          value={selectedMolecule}
          onChange={(e) => setSelectedMolecule(e.value)}
          options={moleculeList}
          optionLabel="name"
          placeholder="Select a Molecule"
          className="w-full"
          //itemTemplate={moleculeTemplate}
          filter
          showClear
          loading={isFetchingMolecules}
        />
      </div>
      <div className="flex min-w-max align-items-center justify-content-center border-1 border-200 border-round-md mr-5">
        <Menu model={sideMenuItems} popup ref={sideMenu} id={"side_menu"} />
        <Button
          icon="pi pi-ellipsis-h"
          className="p-button border-1 border-50"
          outlined
          severity="secondary"
          onClick={(event) => sideMenu.current.toggle(event)}
          aria-controls="popup_menu_left"
          aria-haspopup
        />
      </div>

      <Sidebar
        visible={displayAddSideBar}
        position="right"
        onHide={() => setDisplayAddSideBar(false)}
        className="p-sidebar-md"
        header={addSideBarHeader}
      >
        <MLogixRegisterMolecule
          closeSideBar={() => setDisplayAddSideBar(false)}
        />
      </Sidebar>
    </div>
  );
};

export default observer(FHaNewMoleculePicker);
