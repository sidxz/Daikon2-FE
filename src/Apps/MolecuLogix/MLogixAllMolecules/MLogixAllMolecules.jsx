import { observer } from "mobx-react-lite";
import { DataView } from "primereact/dataview";

import { Sidebar } from "primereact/sidebar";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../../Library/Loading/Loading";
import SecHeading from "../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../RootStore";
import { appColors } from "../../../constants/colors";
import { listTemplate } from "./MLogixAllMoleculesHelper";
import MLogixRegisterMolecule from "./MLogixRegisterMolecule";
const MLogixAllMolecules = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    moleculeList,
    fetchMolecules,
    isFetchingMolecules,
    isMoleculeRegistryCacheValid,
  } = rootStore.moleculeStore;

  const [displayAddSideBar, setDisplayAddSideBar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isMoleculeRegistryCacheValid) {
      fetchMolecules();
    }
  }, [isMoleculeRegistryCacheValid, fetchMolecules]);

  if (isFetchingMolecules) {
    return <Loading message={"Fetching Molecules..."} />;
  }

  const addSideBarHeader = (
    <div className="flex w-full justify-between items-center">
      <h2 className="text-lg font-semibold">Register Molecule</h2>
    </div>
  );

  return (
    <>
      <div className="flex flex-column min-w-full fadein animation-duration-500">
        <div className="flex w-full">
          <SecHeading
            icon="icon icon-conceptual icon-dna"
            heading="All Molecules"
            color={appColors.molecuLogix.heading}
            customButtons={[
              {
                label: "Import Molecules",
                icon: "pi pi-plus",
                action: () => setDisplayAddSideBar(true),
              },
              {
                label: "Register Molecule",
                icon: "pi pi-plus",
                action: () => setDisplayAddSideBar(true),
              },
            ]}
          />
        </div>
        <div className="flex w-full">
          <DataView
            value={moleculeList}
            listTemplate={(items) => listTemplate(items, navigate)}
            layout="grid"
            paginator
            rows={60}
          />
        </div>
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
    </>
  );
};

export default observer(MLogixAllMolecules);
