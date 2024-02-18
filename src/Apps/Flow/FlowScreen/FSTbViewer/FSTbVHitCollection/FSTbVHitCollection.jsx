import { BreadCrumb } from "primereact/breadcrumb";
import { Sidebar } from "primereact/sidebar";
import { TabPanel, TabView } from "primereact/tabview";
import React, { useContext, useEffect, useState } from "react";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import { appColors } from "../../../../../constants/colors";
import FSTbVAddHitCollection from "./FSTbVAddHitCollection";

import { observer } from "mobx-react-lite";
import { FcOpenedFolder } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import Loading from "../../../../../Library/Loading/Loading";
import { RootStoreContext } from "../../../../../RootStore";
import * as Helper from "./FSTbVHitCollectionHelper";
const FSTbVHitCollection = ({ selectedScreen }) => {
  const [displayAddSideBar, setDisplayAddSideBar] = useState(false);
  const navigate = useNavigate();

  const rootStore = useContext(RootStoreContext);
  const {
    fetchHitCollection,
    isFetchingHitCollection,
    isHitCollectionRegistryCacheValid,
    hitCollectionOfScreen,
  } = rootStore.hitCollectionStore;
  useEffect(() => {
    if (!isHitCollectionRegistryCacheValid(selectedScreen.id)) {
      fetchHitCollection(selectedScreen.id);
    }
  }, [isHitCollectionRegistryCacheValid, fetchHitCollection, selectedScreen]);

  if (isFetchingHitCollection) {
    return <Loading message={"Fetching Hit Collection..."} />;
  }

  if (selectedScreen && hitCollectionOfScreen(selectedScreen.id)) {
    let hitCollectionTabs = [];
    hitCollectionOfScreen(selectedScreen.id).forEach((hitCollection) => {
      hitCollectionTabs.push(
        <TabPanel
          header={Helper.hitCollectionNameTemplate(hitCollection)}
          leftIcon={<FcOpenedFolder className="mr-2" />}
          key={hitCollection.id}
        >
          {/* <FSTbVHits hitCollection={hitCollection} /> */}
        </TabPanel>
      );
    });

    return (
      <>
        <div className="flex flex-column w-full">
          <div className="flex w-full">
            <BreadCrumb
              model={Helper.breadCrumbItems(selectedScreen, navigate)}
            />
          </div>
          <div className="flex w-full">
            <SecHeading
              icon="icon icon-conceptual icon-structures-3d"
              heading={"Hits of " + selectedScreen.name}
              displayHorizon={true}
              color={appColors.sectionHeadingBg.screen}
              customButtons={[
                {
                  label: "Add Hit Collection",
                  icon: "pi pi-plus",
                  action: () => setDisplayAddSideBar(true),
                },
              ]}
            />
          </div>
          <div className="flex w-full">
            <TabView>{hitCollectionTabs}</TabView>
          </div>
        </div>
        <Sidebar
          visible={displayAddSideBar}
          position="right"
          onHide={() => setDisplayAddSideBar(false)}
          className="p-sidebar-sm"
          header={Helper.addSideBarHeader}
        >
          <FSTbVAddHitCollection
            selectedScreen={selectedScreen}
            closeSidebar={() => setDisplayAddSideBar(false)}
          />
        </Sidebar>
      </>
    );
  }

  return <div>Loading..</div>;
};

export default observer(FSTbVHitCollection);
