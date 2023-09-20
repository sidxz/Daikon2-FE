import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmbeddedHelp from "../../../../app/common/EmbeddedHelp/EmbeddedHelp";
import FailedLoading from "../../../../app/common/FailedLoading/FailedLoading";
import GeneralConfirmation from "../../../../app/common/GeneralConfirmation/GeneralConfirmation";
import SectionHeading from "../../../../app/common/SectionHeading/SectionHeading";
import StepsList from "../../../../app/common/StepsList/StepsList";
import Unauthorized from "../../../../app/common/Unauthorized/Unauthorized";
import Loading from "../../../../app/layout/Loading/Loading";
import { RootStoreContext } from "../../../../app/stores/rootStore";
import { appColors } from "../../../../colors";

const TargetRename = ({ id }) => {
  const navigate = useNavigate();
  const toast = useRef(null);
  const rootStore = useContext(RootStoreContext);

  const {
    fetchTargetAdmin,
    selectedTarget,
    isRenamingTargets,
    displayLoading,
    renameTarget,
  } = rootStore.targetStoreAdmin;

  const { user } = rootStore.userStore;

  const [newTargetName, setNewTargetName] = useState("");

  useEffect(() => {
    // Fetch target when the component mounts or when the selected target changes
    if (selectedTarget === null || selectedTarget.id !== id) {
      fetchTargetAdmin(id);
    }
  }, [id, selectedTarget, fetchTargetAdmin]);

  if (displayLoading || isRenamingTargets) {
    return <Loading content="Loading Target..." />;
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
      { label: "Rename" },
    ];

    const steps = [
      {
        value: "The target and all its related data will be renamed.",
      },
      {
        value:
          "Screens associated with the target will be renamed to reflect the name of the new target.",
      },
      {
        value:
          "References to the target in discussions will be updated to the name of the new target.",
      },
    ];

    let renameAction = () => {
      if (selectedTarget === null || newTargetName === "") {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Please enter a valid target name.",
        });
        return;
      }
      console.log("Renaming Target");
      console.log(selectedTarget.id, newTargetName);
      renameTarget(selectedTarget.id, newTargetName);
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
              icon="icon icon-common icon-edit"
              heading={"Rename Target"}
              color={"#f4f4f4"}
              textColor={"#000000"}
            />
          </div>
          <div className="flex w-full pl-4">
            This module allows you to rename a target. Please note that this
          </div>
          <div className="flex pl-2 w-full">
            <StepsList steps={steps} />
          </div>
          <div className="flex w-full border-1 p-2 text-lg mb-2">
            Current Target Name: {selectedTarget.name}
          </div>
          <div className="flex w-full border-1 p-2 gap-2 align-content-center mb-2">
            <div className="flex text-lg align-items-center">
              Updated Target Name:{" "}
            </div>
            <div className="flex text-lg align-items-center ">
              <InputText
                value={newTargetName}
                onChange={(e) => setNewTargetName(e.target.value)}
              />
            </div>
            <div className="flex flex-column text-lg align-items-center w-4">
              <EmbeddedHelp>
                <p>
                  Consistent protein nomenclature is indispensable for
                  communication, literature searching and entry retrieval. A
                  good protein name is one which is unique, unambiguous, can be
                  attributed to orthologs from other species and follows
                  official gene nomenclature where applicable. Please adhere to
                  the{" "}
                  <a
                    href="https://www.ncbi.nlm.nih.gov/genome/doc/internatprot_nomenguide"
                    target="_blank"
                    rel="noreferrer"
                  >
                    International Protein Nomenclature Guidelines.
                  </a>
                </p>
              </EmbeddedHelp>
            </div>
          </div>
          <div className="flex w-full border-1 p-2 text-lg">
            <GeneralConfirmation callBack={renameAction} />
          </div>
        </div>
      </React.Fragment>
    );
  }

  return <FailedLoading />;
};

export default observer(TargetRename);
