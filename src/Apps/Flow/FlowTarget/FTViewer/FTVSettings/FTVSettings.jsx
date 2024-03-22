import { BreadCrumb } from "primereact/breadcrumb";
import { Fieldset } from "primereact/fieldset";
import React, { useContext } from "react";
import {
  FcHighPriority,
  FcMediumPriority,
  FcTreeStructure,
} from "react-icons/fc";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../../../../Library/Loading/Loading";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../../../RootStore";
import { appColors } from "../../../../../constants/colors";
import { TargetIcon } from "../../../icons/TargetIcon";
import * as Helper from "./FTVSettingsHelper";
import FTVSettingsRename from "./components/FTVSettingsRename";
import FTVSettingsUpdateGeneAssociation from "./components/FTVSettingsUpdateGeneAssociation";
const FTVSettings = () => {
  const navigate = useNavigate();
  const rootStore = useContext(RootStoreContext);
  const params = useParams();

  const { selectedTarget, isFetchingTarget } = rootStore.targetStore;

  if (isFetchingTarget) {
    return <Loading message={"Fetching Target..."} />;
  }

  if (selectedTarget && !isFetchingTarget) {
    return (
      <div className="flex flex-column min-w-full fadein animation-duration-500">
        <div className="flex w-full">
          <BreadCrumb
            model={Helper.breadCrumbItems(selectedTarget, navigate)}
          />
        </div>
        <div className="flex w-full">
          <SecHeading
            svgIcon={<TargetIcon size={"25em"} />}
            heading={"Target - " + selectedTarget?.name}
            color={appColors.sectionHeadingBg.target}
            displayHorizon={true}
          />
        </div>
        {/* <div className="flex w-full mt-2">
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
              The settings outlined here are part of the "Target" section and
              will not impact any other areas of the app.
            </p>
          </Fieldset>
        </div> */}
        <div className="flex w-full  mt-2">
          <Fieldset
            className="w-full"
            legend={
              <>
                <FcTreeStructure className="mr-2" />
                Update Gene Association
              </>
            }
          >
            <p className="m-0 p-2">
              The settings below are designed to modify inter-section
              relationships throughout the app. Updating these settings will
              have broad implications, impacting overall functionality,
              including features like the Horizon View, among others.
            </p>
            <FTVSettingsUpdateGeneAssociation />
          </Fieldset>
        </div>
        <div className="flex w-full  mt-2">
          <Fieldset
            legend={
              <>
                <FcMediumPriority className="mr-2" />
                Rename Target
              </>
            }
            className="w-full bg-orange-50	border-1 border-yellow-400	"
          >
            <p className="m-0 p-2">
              Adjusting the settings below will alter the relationships between
              different sections within the app. Making these changes can have
              extensive effects on the app's functionality, especially since
              some features may be organized or accessed by their names.
            </p>
            <FTVSettingsRename />
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
            <p className="m-0">Target deletion is currently unavailable.</p>
          </Fieldset>
        </div>
      </div>
    );
  }
  return <p>Loading..</p>;
};

export default FTVSettings;
