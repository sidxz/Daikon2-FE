import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import { Dropdown } from "primereact/dropdown";
import { Sidebar } from "primereact/sidebar";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../../../../Library/Loading/Loading";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../../../RootStore";
import { appColors } from "../../../../../constants/colors";
import { HitCollectionIcon } from "../../../icons/HitCollectionIcon";
import FSPhVAddHitCollection from "./FSPhVAddHitCollection";
import * as Helper from "./FSPhVHitCollectionHelper";
import FSPhVHits from "./FSPhVHits/FSPhVHits";
const FSPhVHitCollection = ({ selectedScreen }) => {
  const [displayAddSideBar, setDisplayAddSideBar] = useState(false);
  const navigate = useNavigate();
  const { hitCollectionId } = useParams();

  const rootStore = useContext(RootStoreContext);
  const {
    fetchHitCollectionsOfScreen,
    isFetchingHitCollection,
    isHitCollectionRegistryCacheValid,
    hitCollectionOfScreen,
    selectedHitCollection,
    getHitCollection,
    isAddingHitCollection,
  } = rootStore.hitCollectionStore;

  const [selectedHitCollectionDropdown, setSelectedHitCollectionDropdown] =
    useState(hitCollectionId);

  useEffect(() => {
    if (hitCollectionId != selectedHitCollectionDropdown) {
      setSelectedHitCollectionDropdown(hitCollectionId);
    }

    if (
      !isAddingHitCollection &&
      (selectedHitCollection === undefined ||
        selectedHitCollection?.id !== hitCollectionId)
    ) {
      fetchHitCollectionsOfScreen(selectedScreen.id);
      getHitCollection(hitCollectionId);
    }
  }, [
    isHitCollectionRegistryCacheValid,
    fetchHitCollectionsOfScreen,
    selectedScreen?.id,
    selectedHitCollection?.id,
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
              svgIcon={<HitCollectionIcon size={"25em"} />}
              heading={"Hits of " + selectedScreen.name}
              displayHorizon={true}
              entryPoint={selectedHitCollection?.id}
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
                    navigate(
                      `/wf/screen/viewer/ph/${selectedScreen.id}/hits/${e.value}`
                    );
                    setSelectedHitCollectionDropdown(e.value);
                  }}
                  options={hitCollections}
                  optionLabel="name"
                  optionValue="id"
                  placeholder="Select a Hit Collection"
                />,
              ]}
            />
          </div>
          <div className="flex w-full">
            <FSPhVHits id={hitCollectionId} />
          </div>
        </div>
        <Sidebar
          visible={displayAddSideBar}
          position="right"
          onHide={() => setDisplayAddSideBar(false)}
          className="p-sidebar-sm"
          header={Helper.addSideBarHeader}
        >
          <FSPhVAddHitCollection
            selectedScreen={selectedScreen}
            closeSidebar={() => setDisplayAddSideBar(false)}
          />
        </Sidebar>
      </>
    );
  }

  return <div>Loading..</div>;
};

export default observer(FSPhVHitCollection);
