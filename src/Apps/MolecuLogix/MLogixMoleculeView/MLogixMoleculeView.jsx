import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import { Menu } from "primereact/menu";
import React, { useContext, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Loading from "../../../Library/Loading/Loading";
import SecHeading from "../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../RootStore";
import { appColors } from "../../../constants/colors";
import MLMViewGeneralInfo from "./MLMViewComponents/MLMViewGeneralInfo";
import MLMViewIdentifiers from "./MLMViewComponents/MLMViewIdentifiers/MLMViewIdentifiers";
import MLMViewOtherInfo from "./MLMViewComponents/MLMViewOtherInfo";
import MLMViewRelations from "./MLMViewComponents/MLMViewRelations/MLMViewRelations";
import MLMViewStructureCanonical from "./MLMViewComponents/MLMViewStructureCanonical";
import * as Helper from "./MLogixMoleculeViewHelper";

const MLogixMoleculeView = () => {
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
  }, [params.id, fetchMolecule, selectedMolecule]);

  if (isFetchingMolecule) {
    return <Loading message={"Fetching Molecule..."} />;
  }

  if (selectedMolecule) {
    console.log("selectedMolecule", selectedMolecule);
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
                icon="icon icon-common icon-math"
                heading={"Molecule - " + selectedMolecule.name}
                color={appColors.sectionHeadingBg.screen}
              />
            </div>

            <div
              className="flex w-full gap-1 border-1 border-50 p-1 border-round-md"
              style={{ minHeight: "33rem" }}
            >
              <div className="flex border-0">
                <MLMViewGeneralInfo selectedMolecule={selectedMolecule} />
              </div>
              <div className="flex">
                <MLMViewStructureCanonical
                  selectedMolecule={selectedMolecule}
                  subStructure={searchParams.get("substructure")}
                />
              </div>
              <div className="flex border-0">
                <MLMViewIdentifiers selectedMolecule={selectedMolecule} />
              </div>
            </div>
            <div className="flex gap-2">
              <MLMViewOtherInfo selectedMolecule={selectedMolecule} />
            </div>
            <div className="flex gap-2">
              <MLMViewRelations selectedMolecule={selectedMolecule} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div>MLogixMoleculeView</div>;
};

export default observer(MLogixMoleculeView);
