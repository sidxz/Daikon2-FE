import { observer } from "mobx-react-lite";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useContext, useEffect } from "react";
import SecHeading from "../../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../../RootStore";
import { appColors } from "../../../../constants/colors";
import * as Helper from "./FLowGeneDashHelper";
const FlowGeneDashboard = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    isGeneListCacheValid,
    isGeneListLoading,
    geneList,
    fetchGenes,
    availableGeneFunctionalCategories,
  } = rootStore.geneStore;

  useEffect(() => {
    if (!isGeneListCacheValid) {
      fetchGenes();
    }
  }, [isGeneListCacheValid, fetchGenes]);

  if (isGeneListLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500">
      <div className="flex w-full">
        <SecHeading
          icon="icon icon-conceptual icon-dna"
          heading="H37Rv Genes"
          color={appColors.sectionHeadingBg.gene}
        />
      </div>
      <div className="flex w-full">
        <DataTable value={geneList} paginator rows={10} filterDisplay="row">
          <Column
            field="accessionNumber"
            header="Accession Number"
            body={Helper.accessionNumberBodyTemplate}
            filter
            filterMatchMode="contains"
            filterPlaceholder="Search"
            className="narrow-column"
            sortable
          />

          <Column
            field="geneName"
            header="Gene Name"
            filter
            filterMatchMode="contains"
            filterPlaceholder="Search"
            className="narrow-column"
            sortable
          />

          <Column
            field="function"
            header="Function"
            filter
            filterMatchMode="contains"
            filterPlaceholder="Search"
          />

          <Column
            field="product"
            header="Product"
            //body={ProductBodyTemplate}
          />

          <Column
            field="functionalCategory"
            header="Functional Category"
            filter
            filterElement={(options) =>
              Helper.functionalCategoryFilter(
                options,
                availableGeneFunctionalCategories
              )
            }
            showFilterMenu={false}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default observer(FlowGeneDashboard);
