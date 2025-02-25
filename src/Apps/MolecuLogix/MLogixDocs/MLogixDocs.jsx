import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import { Menu } from "primereact/menu";
import React, { useContext, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Loading from "../../../Library/Loading/Loading";
import PageInfoPanel from "../../../Library/PageInfoPanel/PageInfoPanel";
import SecHeading from "../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../RootStore";
import { appColors } from "../../../constants/colors";

import ParsedDocsByTags from "../../DocuStore/ParsedDocsByTags/ParsedDocsByTags";
import * as Helper from "./MLogixDocsHelper";

const MLogixDocs = () => {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const rootStore = useContext(RootStoreContext);
  const { fetchMolecule, isFetchingMolecule, selectedMolecule } =
    rootStore.moleculeStore;

  useEffect(() => {
    if (selectedMolecule === undefined || selectedMolecule?.id !== params?.id) {
      fetchMolecule(params.id);
    }

    if (selectedMolecule) {
      if (!searchParams.has("tags")) {
        // Only set the tags if none are present in the URL
        setSearchParams({ tags: selectedMolecule.name });
      }
    }
  }, [
    searchParams,
    setSearchParams,
    params.id,
    fetchMolecule,
    selectedMolecule,
  ]);

  if (isFetchingMolecule) {
    return <Loading message={"Fetching Molecule..."} />;
  }

  console.log("selectedMolecule", selectedMolecule);

  if (selectedMolecule) {
    console.log("selectedMolecule", selectedMolecule);
    return (
      <div className="flex flex-column min-w-full fadein animation-duration-500">
        <div className="flex gap-2">
          <div className="flex flex-column border-1 border-50 p-1 border-round-md gap-2">
            <div className="flex">
              <Menu model={Helper.sidePanelItems(navigate, selectedMolecule)} />
            </div>
            <div className="flex">
              <PageInfoPanel
                dateCreated={selectedMolecule?.dateCreated}
                createdById={selectedMolecule?.createdById}
                dateUpdated={selectedMolecule?.pageLastUpdatedDate}
                updatedById={selectedMolecule?.pageLastUpdatedUser}
              />
            </div>
          </div>
          <div className="flex flex-column w-full">
            <div className="flex">
              <BreadCrumb
                model={Helper.breadCrumbItems(selectedMolecule, navigate)}
              />
            </div>
            <div className="flex w-full">
              <SecHeading
                icon="icon icon-common icon-math"
                heading={"Molecule - " + selectedMolecule.name}
                color={appColors.sectionHeadingBg.screen}
              />
            </div>

            <div className="flex w-full pt-1">
              {/* ParsedDocsByTags automatically reads tags from the URL */}
              <ParsedDocsByTags />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div>MLogixDocs</div>;
};

export default observer(MLogixDocs);
