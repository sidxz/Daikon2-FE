import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import { Fieldset } from "primereact/fieldset";
import React from "react";
import { useNavigate } from "react-router";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import { appColors } from "../../../../../constants/colors";
import FGVPrEssentiality from "./FGVPrEssentiality/FGVPrEssentiality";
import FGVPrProteinProduction from "./FGVPrProteinProduction/FGVPrProteinProduction";

const FGVPrivate = ({ selectedGene }) => {
  const navigate = useNavigate();
  const breadCrumbItems = [
    {
      label: "Genes",
      command: () => {
        navigate("/wf/gene/");
      },
    },
    {
      label: selectedGene.accessionNumber,
      command: () => {
        navigate(`/wf/gene/${selectedGene.id}`);
      },
    },
    { label: "Private Data" },
  ];

  return (
    <div className="flex flex-column w-full">
      <div className="flex w-full">
        <BreadCrumb model={breadCrumbItems} />
      </div>
      <div className="flex w-full">
        <SecHeading
          icon="icon icon-conceptual icon-dna"
          heading={selectedGene.accessionNumber}
          accessionNumber={selectedGene.accessionNumber}
          displayHorizon={true}
          color={appColors.sectionHeadingBg.gene}
          breadCrumbItems={breadCrumbItems}
        />
      </div>

      <div className="flex pt-2">
        <Fieldset className="m-0 flex-grow-1" legend="Essentiality">
          <FGVPrEssentiality selectedGene={selectedGene} />
        </Fieldset>
      </div>

      <div className="flex pt-2">
        <Fieldset className="m-0 flex-grow-1" legend="Protein Production List">
          <FGVPrProteinProduction selectedGene={selectedGene} />
        </Fieldset>
      </div>

      <div className="flex pt-2">
        <Fieldset
          className="m-0 flex-grow-1"
          legend="Protein Activity Assay List"
        ></Fieldset>
      </div>
    </div>
  );
};

export default observer(FGVPrivate);
