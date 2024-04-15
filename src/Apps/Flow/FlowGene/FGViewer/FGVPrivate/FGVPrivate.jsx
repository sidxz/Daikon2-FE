import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import { Fieldset } from "primereact/fieldset";
import React from "react";
import { useNavigate } from "react-router";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import { appColors } from "../../../../../constants/colors";
import { GeneIcon } from "../../../icons/GeneIcon";
import FGVPrCrispriStrain from "./FGVPrCrispriStrain/FGVPrCrispriStrain";
import FGVPrEssentiality from "./FGVPrEssentiality/FGVPrEssentiality";
import FGVPrHypomorph from "./FGVPrHypomorph/FGVPrHypomorph";
import FGVPrProteinActivityAssay from "./FGVPrProteinActivityAssay/FGVPrProteinActivityAssay";
import FGVPrProteinProduction from "./FGVPrProteinProduction/FGVPrProteinProduction";
import FGVPrResistanceMutation from "./FGVPrResistanceMutation/FGVPrResistanceMutation";
import FGVPrUnpublishedStructuralInformation from "./FGVPrUnpublishedStructuralInformation/FGVPrUnpublishedStructuralInformation";
import FGVPrVulnerability from "./FGVPrVulnerability/FGVPrVulnerability";

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

  let temp = {
    id: "60f3b3b3b3b3b3b3b3b3b3b3",
    essentialities: [],
    proteinProductions: [],
    proteinActivityAssays: [],
    hypomorphs: [],
    crispriStrains: [],
    resistanceMutations: [],
    vulnerabilities: [],
    unpublishedStructuralInformations: [],
  };

  console.log("selectedGene", selectedGene);

  return (
    <div className="flex flex-column w-full">
      <div className="flex w-full">
        <BreadCrumb model={breadCrumbItems} />
      </div>
      <div className="flex w-full">
        <SecHeading
          svgIcon={<GeneIcon size={"25em"} />}
          heading={selectedGene.accessionNumber}
          accessionNumber={selectedGene.accessionNumber}
          displayHorizon={true}
          color={appColors.sectionHeadingBg.gene}
          breadCrumbItems={breadCrumbItems}
          entryPoint={selectedGene?.id}
        />
      </div>
      <div className="flex flex-column gap-2">
        <div className="flex pt-2">
          <Fieldset className="m-0 flex-grow-1" legend="Essentiality">
            <FGVPrEssentiality selectedGene={selectedGene} />
          </Fieldset>
        </div>

        <div className="flex pt-2">
          <Fieldset
            className="m-0 flex-grow-1"
            legend="Protein Production List"
          >
            <FGVPrProteinProduction selectedGene={selectedGene} />
          </Fieldset>
        </div>

        <div className="flex pt-2">
          <Fieldset
            className="m-0 flex-grow-1"
            legend="Protein Activity Assay List"
          >
            <FGVPrProteinActivityAssay selectedGene={selectedGene} />
          </Fieldset>
        </div>

        <div className="flex pt-2">
          <Fieldset className="m-0 flex-grow-1" legend="Hypomorph">
            <FGVPrHypomorph selectedGene={selectedGene} />
          </Fieldset>
        </div>

        <div className="flex pt-2">
          <Fieldset className="m-0 flex-grow-1" legend="CRISPRi Strain List">
            <FGVPrCrispriStrain selectedGene={selectedGene} />
          </Fieldset>
        </div>

        <div className="flex pt-2">
          <Fieldset className="m-0 flex-grow-1" legend="Resistance Mutation">
            <FGVPrResistanceMutation selectedGene={selectedGene} />
          </Fieldset>
        </div>

        <div className="flex pt-2">
          <Fieldset className="m-0 flex-grow-1" legend="Vulnerability">
            <FGVPrVulnerability selectedGene={selectedGene} />
          </Fieldset>
        </div>

        <div className="flex pt-2">
          <Fieldset
            className="m-0 flex-grow-1"
            legend="Unpublished Structural Information"
          >
            <FGVPrUnpublishedStructuralInformation selectedGene={temp} />
          </Fieldset>
        </div>
      </div>
    </div>
  );
};

export default observer(FGVPrivate);
