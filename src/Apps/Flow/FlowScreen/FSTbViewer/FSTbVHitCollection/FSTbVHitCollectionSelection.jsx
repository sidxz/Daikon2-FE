import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Sidebar } from "primereact/sidebar";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../../../../Library/Loading/Loading";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../../../RootStore";
import { appColors } from "../../../../../constants/colors";
import FSTbVAddHitCollection from "./FSTbVAddHitCollection";
import * as Helper from "./FSTbVHitCollectionHelper";

const FSTbVHitCollectionSelection = ({ selectedScreen }) => {
  const navigate = useNavigate();
  const rootStore = useContext(RootStoreContext);
  const {
    fetchHitCollectionsOfScreen,
    isFetchingHitCollection,
    isHitCollectionRegistryCacheValid,
    hitCollectionOfScreen,
    selectedHitCollection,
  } = rootStore.hitCollectionStore;

  const [displayAddSideBar, setDisplayAddSideBar] = useState(false);

  useEffect(() => {
    if (!isHitCollectionRegistryCacheValid(selectedScreen.id)) {
      fetchHitCollectionsOfScreen(selectedScreen.id);
    }
  }, [
    isHitCollectionRegistryCacheValid,
    fetchHitCollectionsOfScreen,
    selectedScreen,
    selectedHitCollection,
  ]);

  useEffect(() => {
    if (
      !isFetchingHitCollection &&
      hitCollectionOfScreen(selectedScreen.id).length > 0
    ) {
      // get id of first hit collection
      const hitCollectionId = hitCollectionOfScreen(selectedScreen.id)[0].id;
      navigate(
        `/wf/screen/viewer/tb/${selectedScreen.id}/hits/${hitCollectionId}`
      );
    }
  }, [
    isFetchingHitCollection,
    hitCollectionOfScreen,
    selectedScreen,
    navigate,
  ]);

  const header = <> </>;
  const footer = (
    <>
      <Button
        label="Create a Hit Collection"
        icon="pi pi-plus"
        onClick={() => setDisplayAddSideBar(true)}
      />
    </>
  );

  if (isFetchingHitCollection) {
    return <Loading message={"Fetching Hit Collection..."} />;
  }

  if (
    !isFetchingHitCollection &&
    hitCollectionOfScreen(selectedScreen.id).length === 0
  ) {
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
              entryPoint={selectedScreen?.id}
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
            <Card
              title="No Hit Collection Found"
              subTitle="Add a hit collection to manage hits."
              footer={footer}
              header={header}
            >
              <p className="m-0">
                A hit collection refers to a set of chemical compounds that have
                shown initial promise in preliminary screening tests for
                biological activity against a specific target or disease area.
                This phase is critical in the drug discovery process, as it
                involves identifying potential lead compounds that could be
                further optimized and developed into effective therapeutic
                agents.
              </p>
            </Card>
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

  return <Loading />;
};

export default observer(FSTbVHitCollectionSelection);
