import { BreadCrumb } from "primereact/breadcrumb";
import { Sidebar } from "primereact/sidebar";
import React, { useContext, useEffect, useState } from "react";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import { appColors } from "../../../../../constants/colors";
import FSTbVAddHitCollection from "./FSTbVAddHitCollection";

import { observer } from "mobx-react-lite";
import { Dropdown } from "primereact/dropdown";
import { Route, Routes, useNavigate } from "react-router-dom";
import Loading from "../../../../../Library/Loading/Loading";
import { RootStoreContext } from "../../../../../RootStore";
import * as Helper from "./FSTbVHitCollectionHelper";
import FSTbVHits from "./FSTbVHits/FSTbVHits";

const FSTbVHitCollection = ({ selectedScreen }) => {
  const [displayAddSideBar, setDisplayAddSideBar] = useState(false);
  const navigate = useNavigate();

  const rootStore = useContext(RootStoreContext);
  const {
    fetchHitCollectionsOfScreen,
    isFetchingHitCollection,
    isHitCollectionRegistryCacheValid,
    hitCollectionOfScreen,
    selectedHitCollection,
  } = rootStore.hitCollectionStore;

  const [selectedHitCollectionDropdown, setSelectedHitCollectionDropdown] =
    useState(null);
  useEffect(() => {
    if (!isHitCollectionRegistryCacheValid(selectedScreen.id)) {
      fetchHitCollectionsOfScreen(selectedScreen.id);
    }

    if (selectedHitCollection) {
      setSelectedHitCollectionDropdown({
        id: selectedHitCollection.id,
        name: Helper.hitCollectionNameTemplate(selectedHitCollection),
      });
      navigate(selectedHitCollection.id);
    }
  }, [
    isHitCollectionRegistryCacheValid,
    fetchHitCollectionsOfScreen,
    selectedScreen,
    selectedHitCollection,
    setSelectedHitCollectionDropdown,
  ]);

  if (isFetchingHitCollection) {
    return <Loading message={"Fetching Hit Collection..."} />;
  }

  if (selectedScreen && hitCollectionOfScreen(selectedScreen.id)) {
    const hitCollections = [];

    hitCollectionOfScreen(selectedScreen.id).forEach((hitCollection) => {
      hitCollections.push({
        id: hitCollection.id,
        name: Helper.hitCollectionNameTemplate(hitCollection),
      });
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
              customElements={[
                <Dropdown
                  value={selectedHitCollectionDropdown}
                  onChange={(e) => {
                    navigate(e.value.id);
                    setSelectedHitCollectionDropdown(e.value);
                  }}
                  options={hitCollections}
                  optionLabel="name"
                  placeholder="Select a Hit Collection"
                />,
              ]}
            />
          </div>
          <div className="flex w-full">
            <Routes>
              <Route path=":id" element={<FSTbVHits />} />
            </Routes>
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
