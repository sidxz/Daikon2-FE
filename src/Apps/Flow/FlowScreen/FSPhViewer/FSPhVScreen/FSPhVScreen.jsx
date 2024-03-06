import { BreadCrumb } from "primereact/breadcrumb";
import { Chip } from "primereact/chip";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../../../RootStore";
import { appColors } from "../../../../../constants/colors";
import { FormatScreeningMethod } from "../../shared/Formatters";
import * as Helper from "./FSPhVScreenHelper";

const FSPhVScreen = ({}) => {
  const rootStore = useContext(RootStoreContext);

  const { selectedScreen } = rootStore.screenStore;
  const { navigate } = useNavigate();

  if (selectedScreen) {
    return (
      <div className="flex flex-column w-full">
        <div className="flex w-full">
          <BreadCrumb
            model={Helper.breadCrumbItems(selectedScreen, navigate)}
          />
        </div>
        <div className="flex w-full">
          <SecHeading
            icon="icon icon-conceptual icon-structures-3d"
            heading={"Screen - " + selectedScreen.name}
            displayHorizon={true}
            color={appColors.sectionHeadingBg.screen}
            customElements={[
              <Chip
                label={FormatScreeningMethod(selectedScreen?.method)}
                icon="icon icon-common icon-circle-notch"
              />,
              <Chip
                label={selectedScreen?.primaryOrgName}
                icon="ri-organization-chart"
                className="mr-3"
              />,
            ]}
          />
        </div>
      </div>
    );
  }
  return <div>FSPhVScreens</div>;
};

export default FSPhVScreen;
