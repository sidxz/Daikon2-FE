import { observer } from "mobx-react-lite";
import { BlockUI } from "primereact/blockui";
import { Dropdown } from "primereact/dropdown";
import React, { useContext, useEffect } from "react";
import { RootStoreContext } from "../../../../RootStore";
const InputAssociatedTarget = (props) => {
  const rootStore = useContext(RootStoreContext);
  const {
    targetList,
    fetchTargets,
    isFetchingTargets,
    isTargetListCacheValid,
  } = rootStore.targetStore;

  useEffect(() => {
    if (!isTargetListCacheValid) {
      fetchTargets();
    }
  }, [fetchTargets, isTargetListCacheValid]);

  const targetDropDownOptions = targetList.map((target) => ({
    name: target.name,
    value: target.id,
  }));

  return (
    <BlockUI blocked={isFetchingTargets}>
      <Dropdown
        {...props}
        options={targetDropDownOptions}
        optionLabel="name"
        placeholder="Select target"
        filter
        showClear
        filterBy="name"
        filterIcon="pi pi-search"
        loading={isFetchingTargets}
      />
    </BlockUI>
  );
};

export default observer(InputAssociatedTarget);
