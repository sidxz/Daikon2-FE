import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { DataView } from "primereact/dataview";
import { Fieldset } from "primereact/fieldset";
import { InputText } from "primereact/inputtext";
import { Menu } from "primereact/menu";
import { Slider } from "primereact/slider";
import React, { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SecHeading from "../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../RootStore";
import { appColors } from "../../../constants/colors";
import MolDbAPI from "../api/MolDbAPI";
import MLSimilarSearchCard from "./MLSimilarSearchCard/MLSimilarSearchCard";
import * as Helper from "./MLogixSimilarSearchHelper";

const MLogixSimilarSearch = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [searchValue, setSearchValue] = useState(params.smiles || "");
  const [searchResults, setSearchResults] = useState([]);
  const [similarityThreshold, setSimilarityThreshold] = useState(20);

  const rootStore = useContext(RootStoreContext);

  const searchForSimilarMolecules = () => {
    MolDbAPI.findSimilarMolecules(
      searchValue,
      similarityThreshold / 100,
      10
    ).then((response) => {
      //console.log(response);
      setSearchResults(response);
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
              heading={"Similarity Search"}
              color={appColors.sectionHeadingBg.screen}
            />
          </div>

          <div className="flex w-full gap-2">
            <Fieldset legend="Search" className="w-full">
              <div className="flex w-full">
                <div className="flex w-11 p-2">
                  <InputText
                    className="text-lg w-full"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </div>
                <div className="flex-column">
                  <div className="flex w-14rem p-2">
                    <Slider
                      value={similarityThreshold}
                      onChange={(e) => setSimilarityThreshold(e.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="flex p-2">
                    Threshold : {similarityThreshold}
                  </div>
                </div>
                <div className="flex p-2">
                  <Button
                    label="Search"
                    onClick={() => searchForSimilarMolecules()}
                  />
                </div>
              </div>
            </Fieldset>
          </div>
          <div className="flex w-full gap-2">
            <div className="card">
              <DataView
                value={searchResults}
                listTemplate={searchListTemplate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(MLogixSimilarSearch);
