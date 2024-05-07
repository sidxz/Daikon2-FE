import { observer } from "mobx-react-lite";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Sidebar } from "primereact/sidebar";
import React, { useContext, useEffect, useState } from "react";
import Loading from "../../../Library/Loading/Loading";
import SecHeading from "../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../RootStore";
import { appColors } from "../../../constants/colors";
import MLogixRegisterMolecule from "../MLogixAllMolecules/MLogixRegisterMolecule";
const MLogixDash = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    moleculeList,
    fetchMolecules,
    isFetchingMolecules,
    isMoleculeRegistryCacheValid,
  } = rootStore.moleculeStore;

  const [displayAddSideBar, setDisplayAddSideBar] = useState(false);

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
    <div className="flex flex-column min-w-full fadein animation-duration-500">
      <div className="flex w-full">
        <SecHeading
          icon="icon icon-conceptual icon-dna"
          heading="Molecules"
          color={appColors.molecuLogix.heading}
          customButtons={[
            {
              label: "Register Molecule",
              icon: "pi pi-plus",
              action: () => setDisplayAddSideBar(true),
            },
          ]}
        />
      </div>
      <div className="flex w-full">
        <DataTable value={moleculeList} paginator rows={10} filterDisplay="row">
          <Column
            field="name"
            header="Name"
            filter
            filterMatchMode="contains"
            filterPlaceholder="Search"
            className="narrow-column"
            sortable
          />

          <Column
            field="molecularWeight"
            header="Molecular Weight"
            filter
            filterMatchMode="contains"
            filterPlaceholder="Search"
            className="narrow-column"
          />

          <Column
            field="tpsa"
            header="TPSA"
            filter
            filterMatchMode="contains"
            filterPlaceholder="Search"
            className="narrow-column"
          />

          <Column
            field="smilesCanonical"
            header="SMILES Canonical"
            filter
            showFilterMenu={false}
          />
        </DataTable>
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

export default observer(MLogixDash);
