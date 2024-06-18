import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import { Menu } from "primereact/menu";
import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../../Library/Loading/Loading";
import SecHeading from "../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../RootStore";
import { appColors } from "../../../constants/colors";
import MLMViewGeneralInfo from "./MLMViewComponents/MLMViewGeneralInfo";
import MLMViewStructure from "./MLMViewComponents/MLMViewStructure";
import * as Helper from "./MLogixMoleculeViewHelper";

const MLogixMoleculeView = () => {
  const params = useParams();
  const navigate = useNavigate();
  const rootStore = useContext(RootStoreContext);
  const { fetchMolecule, isFetchingMolecule, selectedMolecule } =
    rootStore.moleculeStore;

  useEffect(() => {
    if (selectedMolecule === undefined || selectedMolecule?.id !== params?.id) {
      fetchMolecule(params.id);
    }
  }, [params.id, fetchMolecule, selectedMolecule]);

  if (isFetchingMolecule) {
    return <Loading message={"Fetching Molecule..."} />;
  }

  if (selectedMolecule) {
    return (
      <div className="flex flex-column min-w-full fadein animation-duration-500">
        <div className="flex gap-2">
          <div className="flex">
            <Menu model={Helper.sidePanelItems(navigate, selectedMolecule)} />
          </div>
          <div className="flex flex-column w-full">
            <div className="flex">
              <BreadCrumb
                model={Helper.breadCrumbItems(selectedMolecule, navigate)}
              />
            </div>
            <div className="flex w-full">
              <SecHeading
                icon="icon icon-conceptual icon-structures-3d"
                heading={selectedMolecule.name}
                color={appColors.sectionHeadingBg.screen}
              />
            </div>

            <div className="flex w-full gap-2">
              <div className="flex max-w-7">
                <MLMViewGeneralInfo selectedMolecule={selectedMolecule} />
              </div>
              <div className="flex">
                <MLMViewStructure selectedMolecule={selectedMolecule} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div>MLogixMoleculeView</div>;
};

export default observer(MLogixMoleculeView);
