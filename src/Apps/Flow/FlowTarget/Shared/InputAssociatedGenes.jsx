import { observer } from "mobx-react-lite";
import { BlockUI } from "primereact/blockui";
import { MultiSelect } from "primereact/multiselect";
import { useContext, useEffect } from "react";
import { RootStoreContext } from "../../../../RootStore";

const InputAssociatedGenes = (props) => {
  const rootStore = useContext(RootStoreContext);
  const { isGeneListCacheValid, isFetchingGenes, geneList, fetchGenes } =
    rootStore.geneStore;

  useEffect(() => {
    if (!isGeneListCacheValid) {
      fetchGenes();
    }
  }, [fetchGenes, isGeneListCacheValid]);

  const geneDropDownOptions = geneList.map((gene) => ({
    name: gene.name,
    accessionNumber: gene.accessionNumber,
    value: gene.id,
  }));

  return (
    <BlockUI blocked={isFetchingGenes}>
      <MultiSelect
        {...props}
        options={geneDropDownOptions}
        //optionLabel="name"
        optionLabel={(option) =>
          option.accessionNumber + " ( " + option.name + " )"
        }
        placeholder="Select genes to associate..."
        filter
        showClear
        filterBy="name"
        filterIcon="pi pi-search"
        loading={isFetchingGenes}
        virtualScrollerOptions={{ itemSize: 43 }}
      />
    </BlockUI>
  );
};

export default observer(InputAssociatedGenes);
