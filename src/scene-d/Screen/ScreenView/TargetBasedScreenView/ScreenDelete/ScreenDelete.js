import { BreadCrumb } from "primereact/breadcrumb";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import FailedLoading from "../../../../../app/common/FailedLoading/FailedLoading";
import GeneralConfirmation from "../../../../../app/common/GeneralConfirmation/GeneralConfirmation";
import SectionHeading from "../../../../../app/common/SectionHeading/SectionHeading";
import StepsList from "../../../../../app/common/StepsList/StepsList";
import Unauthorized from "../../../../../app/common/Unauthorized/Unauthorized";
import Loading from "../../../../../app/layout/Loading/Loading";
import { RootStoreContext } from "../../../../../app/stores/rootStore";
import { appColors } from "../../../../../colors";

const ScreenDelete = ({ TargetName }) => {
  const navigate = useNavigate();
  const toast = useRef(null);
  const rootStore = useContext(RootStoreContext);

  const [selectedTargetToAssociate, setSelectedTargetToAssociate] =
    useState(null);
  const [selectedScreen, setSelectedScreen] = useState(null);

  const {
    filterTargetBasedScreensByTarget,
    filteredScreens,
    displayLoading,

    selectedScreenTargetFilter,
    isTgScreenRegistryCacheValid,

    deleteScreen,
    isDeletingScreen,
  } = rootStore.screenTStore;

  const { user } = rootStore.userStore;

  useEffect(() => {
    if (
      filteredScreens === null ||
      filteredScreens.length === 0 ||
      selectedScreenTargetFilter !== TargetName ||
      !isTgScreenRegistryCacheValid
    )
      filterTargetBasedScreensByTarget(TargetName);
  }, [
    filteredScreens,
    filterTargetBasedScreensByTarget,
    TargetName,
    isTgScreenRegistryCacheValid,
    selectedScreenTargetFilter,
  ]);

  if (displayLoading) {
    return <Loading />;
  }

  /* Only Admins can access this page */
  if (!user.roles.includes("admin")) {
    return <Unauthorized />;
  }

  /* Generate Breadcrumb */
  if (isTgScreenRegistryCacheValid) {
    const breadCrumbItems = [
      {
        label: "Screens",
        command: () => {
          navigate("/d/screen/");
        },
      },
      {
        label: "Target Based",
        command: () => {
          navigate("/d/screen/");
        },
      },
      {
        label: TargetName,
        command: () => {
          navigate(`/d/screen/target-based/${TargetName}`);
        },
      },
      { label: "Delete" },
    ];

    const steps = [
      {
        value: "This will delete the screen.",
      },
      {
        value:
          "Library screens, Hits and projects related to the screen needs to be manually deleted by the user.",
      },
    ];

    let updateAction = () => {
      if (selectedScreen === null) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Please select a screen and a target",
          life: 3000,
        });

        return;
      }

      deleteScreen(selectedScreen.id).then(() => {});
    };

    return (
      <React.Fragment>
        <Toast ref={toast} />

        <div className="flex flex-column w-full">
          <div className="flex w-full pb-2">
            <BreadCrumb model={breadCrumbItems} />
          </div>

          <div className="flex w-full">
            <SectionHeading
              icon="icon icon-common icon-search"
              heading={TargetName}
              entryPoint={TargetName}
              displayHorizon={true}
              color={appColors.sectionHeadingBg.target}
            />
          </div>
          <div className="flex w-full">
            <SectionHeading
              icon="icon icon-common icon-remove"
              heading={"Delete"}
              color={"#f4f4f4"}
              textColor={"#000000"}
            />
          </div>
          <div className="flex w-full pl-4">
            The following actions will be performed:
          </div>
          <div className="flex pl-2 w-full">
            <StepsList steps={steps} />
          </div>
          <div className="flex w-full border-1 p-2 gap-2 align-content-center mb-2">
            <div className="flex text-lg align-items-center w-3">
              Select screen:{" "}
            </div>
            <div className="flex text-lg align-items-center w-3">
              <Dropdown
                value={selectedScreen}
                onChange={(e) => setSelectedScreen(e.value)}
                options={filteredScreens}
                optionLabel="screenName"
                placeholder="Select Screen"
                filter
                filterBy="screenName"
                className="w-full"
              />
            </div>
          </div>

          <div className="flex w-full border-1 p-2 text-lg">
            <GeneralConfirmation
              callBack={updateAction}
              loading={isDeletingScreen}
              disabled={selectedScreen === null}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
  return <FailedLoading />;
};

export default ScreenDelete;
