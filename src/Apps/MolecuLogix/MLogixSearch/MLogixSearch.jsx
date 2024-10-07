import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import { Fieldset } from "primereact/fieldset";
import { Menu } from "primereact/menu";
import { Sidebar } from "primereact/sidebar";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SecHeading from "../../../Library/SecHeading/SecHeading";
import { appColors } from "../../../constants/colors";
import { MolecuLogixIcon } from "../Icons/MolecuLogixIcon";
import MLogixRegisterMolecule from "../MLogixAllMolecules/MLogixRegisterMolecule";
import SearchBar from "./SearchContainer/SearchBar";
import * as Helper from "./helper";
const MLogixSearch = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [displayAddSideBar, setDisplayAddSideBar] = useState(false);

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
              heading={"Search"}
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
              <SearchBar />
            </Fieldset>
          </div>
        </div>
      </div>
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

export default observer(MLogixSearch);
