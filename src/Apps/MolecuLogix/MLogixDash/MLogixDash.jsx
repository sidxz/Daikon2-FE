import { observer } from "mobx-react-lite";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useContext, useEffect } from "react";
import Loading from "../../../Library/Loading/Loading";
import SecHeading from "../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../RootStore";
import { appColors } from "../../../constants/colors";
const MLogixDash = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    moleculeList,
    fetchMolecules,
    isFetchingMolecules,
    isMoleculeRegistryCacheValid,
  } = rootStore.moleculeStore;

  useEffect(() => {
    if (!isMoleculeRegistryCacheValid) {
      fetchMolecules();
    }
  }, [isMoleculeRegistryCacheValid, fetchMolecules]);

  if (isFetchingMolecules) {
    return <Loading message={"Fetching Molecules..."} />;
  }

  console.log(moleculeList);

  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500">
      <div className="flex w-full">
        <SecHeading
          icon="icon icon-conceptual icon-dna"
          heading="Molecules"
          color={appColors.molecuLogix.heading}
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

          <Column
            field="smiles"
            header="SMILES"
            filter
            showFilterMenu={false}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default observer(MLogixDash);
