import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import Loading from "../../../../../../Library/Loading/Loading";
import { RootStoreContext } from "../../../../../../RootStore";

const TPQSelector = ({ selectedGenes, setSelectedGenes }) => {
  const rootStore = useContext(RootStoreContext);
  const { isGeneListCacheValid, isGeneListLoading, geneList, fetchGenes } =
    rootStore.geneStore;

  useEffect(() => {
    if (!isGeneListCacheValid) {
      fetchGenes();
    }
  }, [isGeneListCacheValid, fetchGenes]);

  if (isGeneListLoading) {
    return <Loading message={"Fetching Genes..."} />;
  }

  console.log("selection", selectedGenes);

  return <div>TPQ</div>;
};

export default observer(TPQSelector);
