import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import FailedLoading from "../../../../app/common/FailedLoading/FailedLoading";
import GeneralConfirmation from "../../../../app/common/GeneralConfirmation/GeneralConfirmation";
import SectionHeading from "../../../../app/common/SectionHeading/SectionHeading";
import StepsList from "../../../../app/common/StepsList/StepsList";
import Unauthorized from "../../../../app/common/Unauthorized/Unauthorized";
import Loading from "../../../../app/layout/Loading/Loading";
import { RootStoreContext } from "../../../../app/stores/rootStore";
import { appColors } from "../../../../colors";

const TargetMerge = ({ id }) => {
  const navigate = useNavigate();
  const toast = useRef(null);
  const rootStore = useContext(RootStoreContext);
  const {
    fetchTargetAdmin,
    selectedTarget,
    displayLoading,
    mergeTargets,
    isMergingTargets,
  } = rootStore.targetStoreAdmin;
  const { fetchTargetList, targets } = rootStore.targetStore;

  const { user } = rootStore.userStore;

  const [selectedTargetToBeMerged, setSelectedTargetToBeMerged] =
    useState(null);

  useEffect(() => {
    if (targets.length === 0) fetchTargetList();
    // Fetch target when the component mounts or when the selected target changes
    if (selectedTarget === null || selectedTarget.id !== id) {
      fetchTargetAdmin(id);
    }
  }, [id, selectedTarget, fetchTargetAdmin]);

  if (
    displayLoading ||
    rootStore.targetStore.displayLoading ||
    isMergingTargets
  ) {
    return <Loading />;
  }

  /* Only Admins can access this page */
  if (!user.roles.includes("admin")) {
    return <Unauthorized />;
  }
  /* Generate Breadcrumb */
  if (selectedTarget !== null) {
    const breadCrumbItems = [
      {
        label: "Targets",
        command: () => {
          navigate("/d/target/");
        },
      },
      {
        label: selectedTarget.name,
        command: () => {
          navigate(`/d/target/${selectedTarget.id}`);
        },
      },
      { label: "Merge" },
    ];

    const steps = [
      {
        value:
          "All associations linked to the 'target to be merged' will be transferred to the 'target to be kept'.",
      },
      {
        value:
          "Questionnaires, promotion information, compass data, etc., associated with the 'target to be merged' will be deleted.",
      },
      {
        value:
          "Genes associated with the 'target to be merged' will be transferred to the 'target to be kept'. This may alter the target type to 'protein complex' or 'simple-protein'.",
      },
      {
        value:
          "Screens linked to the 'target to be merged' will be transferred to the 'target to be kept' and will be renamed to include the name of the 'target to be kept'.",
      },
      {
        value:
          "Projects linked to the 'target to be merged' will be moved to the 'target to be kept'.",
      },
      { value: "The 'target to be merged' will be deleted." },
    ];

    let mergeAction = () => {
      console.log("mergeAction");
      console.log(selectedTargetToBeMerged);
      mergeTargets(selectedTarget, selectedTargetToBeMerged);
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
              icon="icon icon-common icon-target"
              heading={selectedTarget.name}
              entryPoint={selectedTarget.name}
              displayHorizon={true}
              color={appColors.sectionHeadingBg.target}
            />
          </div>
          <div className="flex w-full">
            <SectionHeading
              icon="icon icon-common icon-compress"
              heading={"Merge targets"}
              color={"#f4f4f4"}
              textColor={"#000000"}
            />
          </div>
          <div className="flex w-full pl-4">
            This module allows you to merge two targets. The following actions
            will be performed:
          </div>
          <div className="flex pl-2 w-full">
            <StepsList steps={steps} />
          </div>
          <div className="flex w-full border-1 p-2 text-lg mb-2">
            Target to be kept: {selectedTarget.name}
          </div>
          <div className="flex w-full border-1 p-2 gap-2 align-content-center mb-2">
            <div className="flex text-lg align-items-center">
              Target to be merged:{" "}
            </div>
            <div className="flex text-lg align-items-center ">
              <Dropdown
                value={selectedTargetToBeMerged}
                onChange={(e) => setSelectedTargetToBeMerged(e.value)}
                options={targets}
                optionLabel="name"
                placeholder="Select a Target"
                filter
                filterBy="name"
                valueLabel="id"
                className="w-full md:w-14rem"
              />
            </div>
          </div>
          <div className="flex w-full border-1 p-2 text-lg">
            <GeneralConfirmation
              callBack={mergeAction}
              loading={isMergingTargets}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }

  return <FailedLoading />;
};

export default observer(TargetMerge);
