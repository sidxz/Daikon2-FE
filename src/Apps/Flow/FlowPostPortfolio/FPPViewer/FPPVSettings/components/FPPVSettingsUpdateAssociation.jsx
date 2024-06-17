import React, { useContext, useEffect, useState } from "react";

import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { RootStoreContext } from "../../../../../../RootStore";

const FPPVSettingsUpdateAssociation = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    fetchProject,
    selectedProject,
    isFetchingProject,
    isProjectRegistryCacheValid,
    updateProject,
    isUpdatingProject,
    updateProjectAssociation,
  } = rootStore.projectStore;

  const { fetchHAs, isHaListCacheValid, isFetchingHAs, haList } =
    rootStore.haStore;

  useEffect(() => {
    if (!isHaListCacheValid) {
      fetchHAs();
    }
  }, [isHaListCacheValid]);

  const [selectedHa, setSelectedHa] = useState(
    () => haList.find((ha) => ha.id === selectedProject.haId) || null
  );

  useEffect(() => {
    if (haList.length > 0 && selectedProject.haId) {
      const foundHa = haList.find((ha) => ha.id === selectedProject.haId);
      setSelectedHa(foundHa || null);
    }
  }, [haList, selectedProject.haId]);

  //console.log("selectedHa", selectedHa);

  let submit = () => {
    var projectToSubmit = {};
    projectToSubmit.id = selectedProject.id;
    projectToSubmit.haId = selectedHa.id;
    projectToSubmit.compoundId = selectedHa.compoundEvoLatestMoleculeId;
    projectToSubmit.compoundSMILES = selectedHa.compoundEvoLatestSMILES;
    projectToSubmit.hitCompoundId = selectedHa.compoundId;
    projectToSubmit.hitId = selectedHa.hitId;

    //console.log(projectToSubmit);
    updateProjectAssociation(projectToSubmit);
  };

  return (
    <div className="card w-full">
      <div className="field p-fluid">
        <label htmlFor="ha">Select HA</label>
        <Dropdown
          id="ha"
          value={selectedHa}
          options={haList}
          onChange={(e) => {
            setSelectedHa(e.value);
          }}
          placeholder="Select HA"
          optionLabel="name"
          autoFocus
          className="text-base text-color surface-overlay"
          loading={isUpdatingProject}
          readOnly={isUpdatingProject}
        />
      </div>

      <div className="field p-fluid w-6">
        <Button
          icon="icon icon-common icon-database-submit"
          label="Update Association"
          className="p-button-sm p-mt-2 w-6"
          onClick={submit}
          loading={isUpdatingProject}
        />
      </div>
    </div>
  );
};

export default observer(FPPVSettingsUpdateAssociation);
