import { observer } from "mobx-react-lite";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useContext, useEffect, useState } from "react";
import Loading from "../../../../Library/Loading/Loading";
import SecHeading from "../../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../../RootStore";
import { appColors } from "../../../../constants/colors";
import { GeneIcon } from "../../icons/GeneIcon";
import * as Helper from "./FGDashHelper";
const FGDashboard = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    isGeneListCacheValid,
    isGeneListLoading,
    geneList,
    fetchGenes,
    availableGeneFunctionalCategories,
  } = rootStore.geneStore;

  const [filters, setFilters] = useState({
    accessionNumber: { value: "Rv", matchMode: "contains" },
    name: { value: "", matchMode: "contains" },
    functionalCategory: { value: "", matchMode: "contains" },
  });

  useEffect(() => {
    if (!isGeneListCacheValid) {
      fetchGenes();
    }
  }, [isGeneListCacheValid, fetchGenes]);

  if (isGeneListLoading) {
    return <Loading message={"Fetching Genes..."} />;
  }

  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500">
      <div className="flex w-full">
        <SecHeading
          svgIcon={<GeneIcon size={"25em"} />}
          heading="Genes"
          color={appColors.sectionHeadingBg.gene}
        />
      </div>
      <div className="flex w-full">
        <DataTable
          value={geneList}
          paginator
          rows={30}
          loading={isGeneListLoading}
          filterDisplay="row"
          className="w-full"
          emptyMessage="Loading..."
          filters={filters}
          onFilter={(e) => setFilters(e.filters)}
        >
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
            field="name"
            header="Gene Name"
            filter
            filterMatchMode="contains"
            filterPlaceholder="Search"
            className="narrow-column"
            sortable
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
            // filterElement={(options) =>
            //   Helper.functionalCategoryFilter(
            //     options,
            //     availableGeneFunctionalCategories
            //   )
            // }
            showFilterMenu={false}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default observer(FGDashboard);
