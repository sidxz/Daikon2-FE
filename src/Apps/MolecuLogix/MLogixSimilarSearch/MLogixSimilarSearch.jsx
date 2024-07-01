import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { DataView } from "primereact/dataview";
import { Dialog } from "primereact/dialog";
import { Fieldset } from "primereact/fieldset";
import { InputText } from "primereact/inputtext";
import { Menu } from "primereact/menu";
import { Sidebar } from "primereact/sidebar";
import { Slider } from "primereact/slider";
import React, { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import JSMEditor from "../../../Library/JSME/JSMEditor";
import PleaseWait from "../../../Library/PleaseWait/PleaseWait";
import SecHeading from "../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../RootStore";
import { appColors } from "../../../constants/colors";
import { MolecuLogixIcon } from "../Icons/MolecuLogixIcon";
import MLogixRegisterMolecule from "../MLogixAllMolecules/MLogixRegisterMolecule";
import MolDbAPI from "../api/MolDbAPI";
import MLSimilarSearchCard from "./MLSimilarSearchCard/MLSimilarSearchCard";
import * as Helper from "./MLogixSimilarSearchHelper";

const MLogixSimilarSearch = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [searchValue, setSearchValue] = useState(params.smiles ?? "");
  const [searchResults, setSearchResults] = useState([]);
  const [similarityThreshold, setSimilarityThreshold] = useState(20);
  const [loading, setLoading] = useState(false); // Loading state

  const [displayAddSideBar, setDisplayAddSideBar] = useState(false);

  const rootStore = useContext(RootStoreContext);
  const [showStructureEditor, setShowStructureEditor] = useState(false);

  const searchForSimilarMolecules = () => {
    setLoading(true); // Set loading to true before the API call
    MolDbAPI.findSimilarMolecules(searchValue, similarityThreshold / 100, 10)
      .then((response) => {
        setSearchResults(response);
        setLoading(false); // Set loading to false after the API call
      })
      .catch((error) => {
        console.error(error);
        setLoading(false); // Set loading to false if there's an error
      });
  };

  const searchItemTemplate = (molecule, index) => {
    return <MLSimilarSearchCard molecule={molecule} navigate={navigate} />;
  };

  const searchListTemplate = (items) => {
    if (!items || items.length === 0) return null;

    let list = items.map((molecule, index) => {
      return searchItemTemplate(molecule, index);
    });

    return <div className="grid grid-nogutter">{list}</div>;
  };

  const addSideBarHeader = (
    <div className="flex w-full justify-between items-center">
      <h2 className="text-lg font-semibold">Register Molecule</h2>
    </div>
  );

  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500">
      <div className="flex gap-2">
        <div className="flex">
          <Menu model={Helper.sidePanelItems(navigate)} />
        </div>
        <div className="flex flex-column w-full">
          <div className="flex">
            <BreadCrumb model={Helper.breadCrumbItems(navigate)} />
          </div>
          <div className="flex w-full">
            <SecHeading
              icon="icon icon-conceptual icon-structures-3d"
              svgIcon={<MolecuLogixIcon />}
              heading={"Search by SMILES"}
              color={appColors.molecuLogix.heading}
              customButtons={[
                {
                  label: "Register Molecule",
                  icon: "pi pi-plus",
                  action: () => setDisplayAddSideBar(true),
                },
              ]}
            />
          </div>

          <div className="flex w-full gap-2">
            <Fieldset legend="Search" className="w-full">
              <div className="flex w-full align-items-center">
                <div className="flex w-11 p-2">
                  <div className="flex w-full">
                    <InputText
                      className="text-lg w-full"
                      value={searchValue}
                      disabled={loading}
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                  </div>
                  <div className="flex border-1 border-50 p-0">
                    <Button
                      text
                      type="button"
                      icon={<MolecuLogixIcon size={32} />}
                      label="Structure Editor"
                      disabled={loading}
                      onClick={() => setShowStructureEditor(true)}
                    />
                  </div>
                </div>
                <div className="flex-column">
                  <div className="flex w-14rem p-2">
                    <Slider
                      value={similarityThreshold}
                      onChange={(e) => setSimilarityThreshold(e.value)}
                      className="w-full"
                      disabled={loading}
                    />
                  </div>
                  <div className="flex p-2">
                    Threshold : {similarityThreshold}
                  </div>
                </div>
                <div className="flex p-2">
                  <Button
                    label="Search"
                    loading={loading}
                    disabled={searchValue === ""}
                    onClick={() => searchForSimilarMolecules()}
                  />
                </div>
              </div>
            </Fieldset>
          </div>
          <div className="flex w-full gap-2">
            <div className="card w-full m-2 fadein animation-duration-500">
              {loading ? (
                <PleaseWait height="50px" />
              ) : (
                <DataView
                  className="fadein animation-duration-500"
                  value={searchResults}
                  listTemplate={searchListTemplate}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Dialog
        visible={showStructureEditor}
        closable={false}
        modal={false}
        showHeader={false}
        onHide={() => setShowStructureEditor(false)}
      >
        <div className="flex pt-5">
          <JSMEditor
            initialSmiles={searchValue}
            onSave={(s) => {
              setShowStructureEditor(false);
              setSearchValue(s);
            }}
          />
        </div>
      </Dialog>

      <Sidebar
        visible={displayAddSideBar}
        position="right"
        onHide={() => setDisplayAddSideBar(false)}
        className="p-sidebar-md"
        header={addSideBarHeader}
      >
        <MLogixRegisterMolecule
          closeSideBar={() => setDisplayAddSideBar(false)}
        />
      </Sidebar>
    </div>
  );
};

export default observer(MLogixSimilarSearch);
