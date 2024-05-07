import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Fieldset } from "primereact/fieldset";
import {
  FcHighPriority,
  FcMediumPriority,
  FcTreeStructure,
} from "react-icons/fc";

import Loading from "../../../../../Library/Loading/Loading";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../../../RootStore";
import { appColors } from "../../../../../constants/colors";
import { PostPortfolioIcon } from "../../../icons/PostPortfolioIcon";

import * as Helper from "./FPPVSettingsHelper";
import FPPVSettingsDates from "./components/FPPVSettingsDates";
import FPPVSettingsRemove from "./components/FPPVSettingsRemove";
import FPPVSettingsUpdateAssociation from "./components/FPPVSettingsUpdateAssociation";

const FPPVSettings = () => {
  const navigate = useNavigate();
  const rootStore = useContext(RootStoreContext);
  const {
    fetchProject,
    selectedProject,
    isFetchingProject,
    isProjectRegistryCacheValid,
  } = rootStore.projectStore;
  const params = useParams();

  useEffect(() => {
    if (
      selectedProject === undefined ||
      selectedProject?.id !== params?.id ||
      !isProjectRegistryCacheValid
    ) {
      console.log("Fetching Project");
      fetchProject(params.id);
    }
  }, [params.id, fetchProject, selectedProject, isProjectRegistryCacheValid]);

  if (isFetchingProject) {
    return <Loading message={"Fetching Project..."} />;
  }

  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500">
      <div className="flex w-full">
        <BreadCrumb model={Helper.breadCrumbItems(selectedProject, navigate)} />
      </div>
      <div
        className="flex w-full"
        style={{
          filter: selectedProject?.isProjectRemoved
            ? "grayscale(100%)"
            : "none",
        }}
      >
        <SecHeading
          svgIcon={<PostPortfolioIcon size={"25em"} />}
          heading={"Post Portfolio - " + selectedProject.name}
          displayHorizon={true}
          color={appColors.sectionHeadingBg.project}
          entryPoint={selectedProject?.id}
        />
      </div>

      <div className="flex w-full  mt-2">
        <Fieldset
          className="w-full"
          legend={
            <>
              <FcTreeStructure className="mr-2" />
              Update Project Dates
            </>
          }
        >
          <p className="m-0 p-2">
            Updating these settings will have impact post portfolio projects.
          </p>
          <FPPVSettingsDates />
        </Fieldset>
      </div>

      <div className="flex w-full  mt-2">
        <Fieldset
          className="w-full"
          legend={
            <>
              <FcTreeStructure className="mr-2" />
              Update Hit Assessment Association
            </>
          }
        >
          <p className="m-0 p-2">
            The settings below are designed to modify inter-section
            relationships throughout the app. Updating these settings will have
            broad implications, impacting overall functionality, including
            features like the Horizon View, among others.
          </p>
          <FPPVSettingsUpdateAssociation />
        </Fieldset>
      </div>

      <div className="flex w-full  mt-2">
        <Fieldset
          legend={
            <>
              <FcMediumPriority className="mr-2" />
              Rename Project
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
        </Fieldset>
      </div>
      <div className="flex w-full  mt-2">
        <Fieldset
          legend={
            <>
              <FcMediumPriority className="mr-2" />
              Remove Project
            </>
          }
          className="w-full bg-orange-50	border-1 border-yellow-400	"
        >
          <p className="m-0 p-2">
            Adjusting the settings below will alter the relationships between
            different sections within the app.
          </p>
          <FPPVSettingsRemove />
        </Fieldset>
      </div>
      <div className="flex w-full mt-2 ">
        <Fieldset
          legend={
            <>
              <FcHighPriority className="mr-2" />
              Delete Project
            </>
          }
          className="w-full bg-red-50 border-1 border-red-400"
        >
          <p className="m-0">Project deletion is currently unavailable.</p>
        </Fieldset>
      </div>
    </div>
  );
};

export default observer(FPPVSettings);
