import { BreadCrumb } from "primereact/breadcrumb";
import { Chip } from "primereact/chip";
import { Fieldset } from "primereact/fieldset";
import React, { useContext, useState } from "react";
import {
  FcBusiness,
  FcHighPriority,
  FcMediumPriority,
  FcTreeStructure,
} from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import Loading from "../../../../../Library/Loading/Loading";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../../../RootStore";
import { AppOrgResolver } from "../../../../../Shared/VariableResolvers/AppOrgResolver";
import { appColors } from "../../../../../constants/colors";
import * as Helper from "./FSPhVSettingsHelper";
import FSPhVSettings_Basic from "./components/FSPhVSettings_Basic";
import FSPhVSettings_Rename from "./components/FSPhVSettings_Rename";
import FSPhVSettings_UpdateTarget from "./components/FSPhVSettings_UpdateTarget";

const FSPhVSettings = () => {
  const navigate = useNavigate();
  const rootStore = useContext(RootStoreContext);
  const { getOrgNameById } = AppOrgResolver();

  const { fetchScreen, isFetchingScreen, selectedScreen } =
    rootStore.screenStore;

  const {
    updateScreenRun,
    isUpdatingScreenRun,
    isAddingScreenRun,
    isDeletingScreenRun,
    deleteScreenRun,
  } = rootStore.screenRunStore;

  const [displayAddScreenSeqSideBar, setDisplayAddScreenSeqSideBar] =
    useState(false);

  if (isFetchingScreen) {
    return <Loading message={"Fetching Screen..."} />;
  }

  if (selectedScreen && !isFetchingScreen) {
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
              heading={"Screen - " + selectedScreen.name}
              displayHorizon={true}
              entryPoint={selectedScreen?.id}
              color={appColors.sectionHeadingBg.screen}
              customElements={[
                <Chip
                  label={getOrgNameById(selectedScreen?.primaryOrgId)}
                  icon="ri-organization-chart"
                  className="mr-3"
                />,
              ]}
            />
          </div>

          <div className="flex w-full mt-2">
            <Fieldset
              className="w-full"
              legend={
                <>
                  <FcBusiness className="mr-2" />
                  Settings
                </>
              }
            >
              <p className="m-0 p-2">
                The settings outlined here are part of the "Screen" section and
                will not impact any other areas of the app.
              </p>
              <FSPhVSettings_Basic />
            </Fieldset>
          </div>
          <div className="flex w-full  mt-2">
            <Fieldset
              className="w-full"
              legend={
                <>
                  <FcTreeStructure className="mr-2" />
                  Update Target Association
                </>
              }
            >
              <p className="m-0 p-2">
                The settings below are designed to modify inter-section
                relationships throughout the app. Updating these settings will
                have broad implications, impacting overall functionality,
                including features like the Horizon View, among others.
              </p>
              <FSPhVSettings_UpdateTarget />
            </Fieldset>
          </div>
          <div className="flex w-full  mt-2">
            <Fieldset
              legend={
                <>
                  <FcMediumPriority className="mr-2" />
                  Rename Screen
                </>
              }
              className="w-full bg-orange-50	border-1 border-yellow-400	"
            >
              <p className="m-0 p-2">
                Adjusting the settings below will alter the relationships
                between different sections within the app. Making these changes
                can have extensive effects on the app's functionality,
                especially since some features may be organized or accessed by
                their names.
              </p>
              <FSPhVSettings_Rename />
            </Fieldset>
          </div>
          <div className="flex w-full mt-2 ">
            <Fieldset
              legend={
                <>
                  <FcHighPriority className="mr-2" />
                  Delete
                </>
              }
              className="w-full bg-red-50 border-1 border-red-400"
            >
              <p className="m-0">Screen deletion is currently unavailable.</p>
            </Fieldset>
          </div>
        </div>
      </>
    );
  }
  return <div>FSPhVSettings</div>;
};

export default FSPhVSettings;
