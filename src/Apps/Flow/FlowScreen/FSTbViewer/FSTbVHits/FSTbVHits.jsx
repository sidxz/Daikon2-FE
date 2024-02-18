import { BreadCrumb } from "primereact/breadcrumb";
import { Sidebar } from "primereact/sidebar";
import { TabPanel, TabView } from "primereact/tabview";
import React, { useState } from "react";
import { FcOpenedFolder } from "react-icons/fc";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import { appColors } from "../../../../../constants/colors";
import FSTbVAddHitCollection from "./FSTbVAddHitCollection";
import FSTbVHitCollection from "./FSTbVHitCollection/FSTbVHitCollection";

const FSTbVHits = ({ selectedScreen }) => {
  const [displayAddSideBar, setDisplayAddSideBar] = useState(false);

  const breadCrumbItems = [
    {
      label: "Screens",
      command: () => {
        navigate("/wf/screen/");
      },
    },
    {
      label: selectedScreen.name,
      command: () => {
        navigate(`/wf/screen/viewer/tb/${selectedScreen.id}`);
      },
    },
    { label: "Hits" },
  ];

  const addSideBarHeader = (
    <div className="flex align-items-center gap-2">
      <i className="icon icon-common icon-plus-circle"></i>
      <span className="font-bold">Add Hit Collection</span>
    </div>
  );

  const hitCollectionTabHeaderTemplate = (options, hitCollection) => {
    console.log("FSTbVHits -> hitCollection", hitCollection);
    return (
      <div
        className="flex align-items-center gap-2 p-3"
        style={{ cursor: "pointer" }}
        onClick={options.onClick}
      >
        <FcOpenedFolder />

        <span className="white-space-nowrap">
          {hitCollection.hitCollectionType} ({hitCollection.name})
        </span>
      </div>
    );
  };

  if (selectedScreen) {
    console.log("FSTbVHits -> selectedScreen", selectedScreen);
    let hitCollectionTabs = [];
    selectedScreen.hitCollections.forEach((hitCollection) => {
      hitCollectionTabs.push(
        <TabPanel
          headerTemplate={(options) =>
            hitCollectionTabHeaderTemplate(options, hitCollection)
          }
          key={hitCollection.id}
        >
          <FSTbVHitCollection hitCollection={hitCollection} />
        </TabPanel>
      );
    });

    return (
      <>
        <div className="flex flex-column w-full">
          <div className="flex w-full">
            <BreadCrumb model={breadCrumbItems} />
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
          header={addSideBarHeader}
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

export default FSTbVHits;
