import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import React, { useContext, useState } from "react";
import { RootStoreContext } from "../../../../../../RootStore";
import PortfolioPriorityGauge from "../../../shared/PortfolioPriorityGauge";
import PortfolioProbabilityGauge from "../../../shared/PortfolioProbabilityGauge";
const FPVIProjectInfoPriority = () => {
  const rootStore = useContext(RootStoreContext);
  const [visible, setVisible] = useState(false);
  const { selectedProject, isFetchingProject } = rootStore.projectStore;

  return (
    <>
      <div className="flex flex-column">
        <div className="table-header flex flex-row w-full shadow-0 fadein">
          <div className="flex justify-content-end w-full">
            <div className="flex flex-grow min-w-max">
              <Button
                type="button"
                icon="pi pi-plus"
                label="Set"
                className="p-button-text p-button-sm"
                onClick={() => setVisible(true)}
              />
            </div>
          </div>
        </div>
        <div className="flex w-full align-items-center gap-1">
          <div className="flex">
            <PortfolioPriorityGauge priority={selectedProject?.priority} />
          </div>

          <div className="flex">
            <PortfolioProbabilityGauge priority={selectedProject?.priority} />
          </div>
        </div>
      </div>
      <Sidebar
        visible={visible}
        position="right"
        header={<h2>Team Settings</h2>}
        onHide={() => setVisible(false)}
      ></Sidebar>
    </>
  );
};

export default observer(FPVIProjectInfoPriority);
