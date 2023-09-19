import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import { MultiSelect } from "primereact/multiselect";
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

const TargetGeneAssociation = ({ id }) => {
  const navigate = useNavigate();
  const toast = useRef(null);
  const rootStore = useContext(RootStoreContext);
  const {
    fetchTargetAdmin,
    selectedTarget,
    displayLoading,
    isUpdatingGeneAssociation,
    updateGeneAssociation,
  } = rootStore.targetStoreAdmin;
  const { fetchTargetList, targets } = rootStore.targetStore;
  const { fetchGeneList, genes } = rootStore.geneStore;

  const { user } = rootStore.userStore;

  const [selectedGenes, setSelectedGenes] = useState([]);

  useEffect(() => {
    if (genes.length === 0) fetchGeneList();
    if (targets.length === 0) fetchTargetList();
    // Fetch target when the component mounts or when the selected target changes
    if (selectedTarget === null || selectedTarget.id !== id) {
      fetchTargetAdmin(id);
    }
  }, [id, selectedTarget, fetchTargetAdmin, genes, fetchGeneList]);

  if (
    displayLoading ||
    rootStore.targetStore.displayLoading ||
    rootStore.geneStore.displayLoading ||
    isUpdatingGeneAssociation
  ) {
    return <Loading />;
  }

  console.log("selectedTarget");
  console.log(selectedTarget);

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
      { label: "Update Gene Association" },
    ];

    const steps = [
      {
        value: "This will update the genes associated with this target'.",
      },
      {
        value:
          "This might change the target type to 'protein complex' or 'simple-protein' depending on the number of genes association.",
      },
    ];

    let updateAction = () => {
      if (selectedGenes.length === 0) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Please select at least one gene",
          life: 3000,
        });

        return;
      }

      // make an array of guids of selected genes
      var formattedGenes = selectedGenes.map((gene) => {
        return gene.id;
      });

      console.log("selectedGenes");
      console.log(formattedGenes);
      updateGeneAssociation(selectedTarget.id, formattedGenes);
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
              icon="icon icon-conceptual icon-proteins"
              heading={"Update Gene Association"}
              color={"#f4f4f4"}
              textColor={"#000000"}
            />
          </div>
          <div className="flex w-full pl-4">
            This module allows you to alter the genes associated with the
            target. The following actions will be performed:
          </div>
          <div className="flex pl-2 w-full">
            <StepsList steps={steps} />
          </div>
          <div className="flex w-full border-1 p-2 text-lg mb-2">
            Current Genes:{" "}
            {selectedTarget?.targetGenes
              ?.map((gene) => gene.accessionNumber)
              .join(", ")}
          </div>
          <div className="flex w-full border-1 p-2 gap-2 align-content-center mb-2">
            <div className="flex text-lg align-items-center">
              Updated Gene List:{" "}
            </div>
            <div className="flex text-lg align-items-center ">
              <MultiSelect
                value={selectedGenes}
                onChange={(e) => setSelectedGenes(e.value)}
                options={genes}
                optionLabel="accessionNumber"
                placeholder="Select Genes"
                display="chip"
                filter
                filterBy="accessionNumber"
                className="w-full"
              />
            </div>
          </div>
          <div className="flex w-full border-1 p-2 text-lg">
            <GeneralConfirmation
              callBack={updateAction}
              loading={isUpdatingGeneAssociation}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }

  return <FailedLoading />;
};

export default observer(TargetGeneAssociation);
