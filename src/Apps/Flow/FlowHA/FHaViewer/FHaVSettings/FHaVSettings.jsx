import { BreadCrumb } from "primereact/breadcrumb";
import { Fieldset } from "primereact/fieldset";
import React, { useContext, useEffect } from "react";
import {
  FcHighPriority,
  FcLowPriority,
  FcMediumPriority,
} from "react-icons/fc";
import { useNavigate, useParams } from "react-router-dom";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../../../RootStore";
import { appColors } from "../../../../../constants/colors";
import { HAIcon } from "../../../icons/HAIcon";
import * as Helper from "./FHaVSettingsHelper";
import FHaVSettingsDates from "./components/FHaVSettingsDates";
import FHaVSettingsOrgs from "./components/FHaVSettingsOrgs";
import FHaVSettingsRemove from "./components/FHaVSettingsRemove";
import FHaVSettingsRename from "./components/FHaVSettingsRename";

const FHaVSettings = () => {
  const navigate = useNavigate();
  const rootStore = useContext(RootStoreContext);
  const { fetchHa, selectedHa, isFetchingHa, isHaRegistryCacheValid } =
    rootStore.haStore;
  const params = useParams();

  useEffect(() => {
    if (
      selectedHa === undefined ||
      selectedHa?.id !== params?.id ||
      !isHaRegistryCacheValid
    ) {
      console.log("Fetching Ha");
      fetchHa(params.id);
    }
  }, [params.id, fetchHa, selectedHa, isHaRegistryCacheValid]);

  if (isFetchingHa) {
    return <Loading message={"Fetching Ha..."} />;
  }

  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500">
      <div className="flex w-full">
        <BreadCrumb model={Helper.breadCrumbItems(selectedHa, navigate)} />
      </div>
      <div
        className="flex w-full"
        style={{
          filter: selectedHa?.isHaRemoved ? "grayscale(100%)" : "none",
        }}
      >
        <SecHeading
          svgIcon={<HAIcon size={"25em"} />}
          heading={"Ha - " + selectedHa.name}
          displayHorizon={true}
          color={appColors.sectionHeadingBg.ha}
          entryPoint={selectedHa?.id}
        />
      </div>
      <div className="flex w-full  mt-2">
        <Fieldset
          legend={
            <>
              <FcLowPriority className="mr-2" />
              HA Dates
            </>
          }
          className="w-full border-1 border-50"
        >
          <p className="m-0 p-2">
            Adjusting the dates below will alter the HA dates within the app.
          </p>
          <FHaVSettingsDates />
        </Fieldset>
      </div>
      <div className="flex w-full mt-2">
        <Fieldset
          legend={
            <>
              <FcLowPriority className="mr-2" />
              Orgs
            </>
          }
          className="w-full border-1 border-50"
        >
          <FHaVSettingsOrgs />
        </Fieldset>
      </div>

      <div className="flex w-full mt-2">
        <Fieldset
          legend={
            <>
              <FcMediumPriority className="mr-2" />
              Rename HA
            </>
          }
          className="w-full bg-orange-50	border-1 border-yellow-400	"
        >
          <p className="m-0 p-2">
            Adjusting the settings below will alter the relationships between
            different sections within the app. Making these changes can have
            extensive effects on the app's functionality, especially since some
            features may be organized or accessed by their names.
          </p>
          <FHaVSettingsRename />
        </Fieldset>
      </div>
      <div className="flex w-full  mt-2">
        <Fieldset
          legend={
            <>
              <FcMediumPriority className="mr-2" />
              Remove HA
            </>
          }
          className="w-full bg-orange-50	border-1 border-yellow-400	"
        >
          <p className="m-0 p-2">
            Adjusting the settings below will alter the relationships between
            different sections within the app.
          </p>
          <FHaVSettingsRemove />
        </Fieldset>
      </div>
      <div className="flex w-full mt-2 ">
        <Fieldset
          legend={
            <>
              <FcHighPriority className="mr-2" />
              Delete HA
            </>
          }
          className="w-full bg-red-50 border-1 border-red-400"
        >
          <p className="m-0">HA deletion is currently unavailable.</p>
        </Fieldset>
      </div>
    </div>
  );
};

export default FHaVSettings;
