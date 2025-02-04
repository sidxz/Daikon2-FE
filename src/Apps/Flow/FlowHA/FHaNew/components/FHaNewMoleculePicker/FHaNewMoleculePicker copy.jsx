import { AutoComplete } from "primereact/autocomplete";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { Sidebar } from "primereact/sidebar";
import React, { useContext, useEffect, useRef, useState } from "react";
import SmilesView from "../../../../../../Library/SmilesView/SmilesView";
import { RootStoreContext } from "../../../../../../RootStore";

import { MolecuLogixIcon } from "../../../../../MolecuLogix/Icons/MolecuLogixIcon";
import MLogixRegisterMolecule from "../../../../../MolecuLogix/MLogixAllMolecules/MLogixRegisterMolecule";
import MolDbAPI from "../../../../../MolecuLogix/api/MolDbAPI";

const FHaNewMoleculePicker = ({ selectedMolecule, setSelectedMolecule }) => {
  const rootStore = useContext(RootStoreContext);
  const { isMoleculeRegistryCacheValid, fetchMolecules } =
    rootStore.moleculeStore;

  const sideMenu = useRef(null);
  const [displayAddSideBar, setDisplayAddSideBar] = useState(false);
  const [filteredMolecules, setFilteredMolecules] = useState([]);

  const searchMolecules = async (event) => {
    const query = "Limit=5&Name=" + event.query;
    console.log("searchMolecules query:", query);
    try {
      const response = await MolDbAPI.findByName(query);
      console.log("searchMolecules response:", response);
      const molecules = response || [];
      console.log("searchMolecules molecules:", molecules);
      setFilteredMolecules(molecules);
    } catch (error) {
      console.error("Error fetching molecules by name:", error);
    }
  };

  useEffect(() => {
    if (!isMoleculeRegistryCacheValid) {
      fetchMolecules();
    }
  }, [isMoleculeRegistryCacheValid, fetchMolecules]);

  let moleculeTemplate = (molecule) => {
    return (
      <div
        className="flex gap-2 border-1 border-50 p-2 m-1 w-full"
        id={molecule.id}
        key={molecule.id}
      >
        <div className="flex border-1 border-50">
          <SmilesView
            smiles={molecule.smilesCanonical}
            subStructure={null}
            width={150}
            height={150}
          />
        </div>
        <div className="flex flex-column gap-1">
          <div className="flex">
            <p className="text-lg m-0">{molecule.name}</p>
          </div>
          <div className="flex">
            <p className="text-sm m-0">Synonyms: {molecule.synonyms}</p>
          </div>
          <div className="flex">
            <p className="m-0 text-color-secondary">
              Mol Mass (g/mol): {molecule.molecularWeight}
            </p>
          </div>
          <div className="flex">
            <p className="m-0 text-color-secondary">
              TPSA (Å²): {molecule.tpsa}
            </p>
          </div>
          <div className="flex">
            <p className="m-0 text-color-secondary">cLog P: {molecule.cLogP}</p>
          </div>
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
        <AutoComplete
          delay={500}
          size={120}
          style={{ width: "100%" }}
          value={selectedMolecule}
          onChange={(e) => setSelectedMolecule(e.value)}
          suggestions={filteredMolecules}
          completeMethod={searchMolecules}
          field="name"
          placeholder="Search for a Molecule by Name"
          itemTemplate={moleculeTemplate}
          forceSelection
        />
      </div>
      <div className="flex min-w-max align-items-center justify-content-center border-1 border-200 border-round-md mr-5">
        <Menu model={sideMenuItems} popup ref={sideMenu} id={"side_menu"} />
        <Button
          icon="pi pi-ellipsis-h"
          iconPos="right"
          label="Other Options"
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

//export default observer(FHaNewMoleculePicker);
