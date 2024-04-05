import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Fieldset } from "primereact/fieldset";
import React from "react";
import { useNavigate } from "react-router";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import { appColors } from "../../../../../constants/colors";
import { GeneIcon } from "../../../icons/GeneIcon";
import FGVPProteinDataBank from "./FGVPProteinDataBank/FGVPProteinDataBank";

const FGVPublic = ({ selectedGene }) => {
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
    { label: "Public Data" },
  ];

  let generalInfoData = [
    { name: "Gene Name", value: selectedGene.name },
    { name: "Function", value: selectedGene.function },
    { name: "Product", value: selectedGene.product },
    { name: "Functional Category", value: selectedGene.functionalCategory },
  ];

  let coordinatesData = [
    { name: "Start", value: selectedGene.start || 0 },
    { name: "End", value: selectedGene.end || 0 },
    { name: "Orientation", value: selectedGene.strand || 0 },
  ];

  let orthologsData = [
    { name: "M. leprae", value: "ML1547,ML1547c" },
    { name: "M. marinum", value: "MMAR_1916" },
    { name: "M. smegmatis", value: "MSMEG_2648" },
  ];

  let mycobrowswerCommentsData = [
    {
      name: "Comments",
      value:
        "Rv2794c, (MTV002.59c), len: 227 aa. PptT, phosphopantetheinyl transferase, equivalent to Q9Z5I5|ML1547|MLCB596.23 putative iron-chelating complex subunit from Mycobacterium leprae (227 aa), FASTA scores: opt: 1248, E(): 9.1e-77, (79.75% identity in 227 aa overlap). Also highly similar to various proteins e.g. Q9F0Q6|PPTA phosphopantetheinyl transferase from Streptomyces verticillus (246 aa), FASTA scores: opt: 692, E(): 2.8e-39, (46.65% identity in 225 aa overlap); O88029|SC5A7.23 hypothetical 24.5 KDA protein from Streptomyces coelicolor (226 aa), FASTA scores: opt: 679, E(): 2e-38, (46.9% identity in 226 aa overlap); O24813 DNA for L-proline 3-hydroxylase from Streptomyces sp. (208 aa), FASTA scores: opt: 631, E(): 3.2e-35, (48.1% identity in 208 aa overlap); etc.",
    },
  ];

  let proteinSummaryData = [
    {
      name: "Molecular Mass",
      value: "24708.5 Da",
    },
    {
      name: "Isoelectric Point",
      value: "5.1",
    },
    {
      name: "Protein Length",
      value: "227 amino acids",
    },
  ];

  let geneSummaryData = [
    {
      name: "Gene Length",
      value: "681 bp",
    },
    {
      name: "Location",
      value: "3103257",
    },
  ];

  let genomicSequenceData =
    "GTGCACACCCAGGTACACACGGCCCGCCTGGTCCACACCGCCGATCTTGACAGCGAGACCCGCCAGGACATCCGTCAGATGGTCACCGGCGCGTTTGCCGGTGACTTCACCGAGACCGACTGGGAGCACACGCTGGGTGGGATGCACGCCCTGATCTGGCATCACGGGGCGATCATCGCGCATGCCGCGGTGATCCAGCGGCGACTGATCTACCGCGGCAACGCGCTGCGCTGCGGGTACGTCGAAGGCGTTGCGGTGCGGGCGGACTGGCGGGGCCAACGCCTGGTGAGCGCGCTGTTGGACGCCGTCGAGCAGGTGATGCGCGGCGCTTACCAGCTCGGAGCGCTCAGTTCCTCGGCGCGGGCCCGCAGACTGTACGCCTCACGCGGCTGGCTGCCCTGGCACGGCCCGACATCGGTACTGGCACCAACCGGTCCAGTCCGTACACCCGATGACGACGGAACGGTGTTCGTCCTGCCCATCGACATCAGCCTGGACACCTCGGCGGAGCTGATGTGCGATTGGCGCGCGGGCGACGTCTGGTAA";
  let proteinSequenceData =
    "VHTQVHTARLVHTADLDSETRQDIRQMVTGAFAGDFTETDWEHTLGGMHALIWHHGAIIAHAAVIQRRLIYRGNALRCGYVEGVAVRADWRGQRLVSALLDAVEQVMRGAYQLGALSSSARARRLYASRGWLPWHGPTSVLAPTGPVRTPDDDGTVFVLPIDISLDTSAELMCDWRAGDVW";

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

      <div className="flex gap-2">
        <div className="flex flex-column gap-2">
          <div className="flex pt-2">
            <Fieldset className="m-0 flex-grow-1" legend="General annotation">
              <DataTable
                value={generalInfoData}
                className="HideDataTableHeader"
              >
                <Column field="name"></Column>
                <Column field="value"></Column>
              </DataTable>
            </Fieldset>
          </div>

          <div className="flex pt-2">
            <Fieldset className="m-0 flex-grow-1" legend="Mycobrowser Comments">
              <DataTable
                value={mycobrowswerCommentsData}
                className="HideDataTableHeader"
              >
                <Column field="name"></Column>
                <Column field="value"></Column>
              </DataTable>
            </Fieldset>
          </div>

          <div className="flex gap-2">
            <Fieldset className="m-0 flex-grow-1" legend="Protein Databank">
              <FGVPProteinDataBank
                accessionNumber={selectedGene.accessionNumber}
                UniprotID={"P9WQG9"}
              />
            </Fieldset>
          </div>

          <div className="flex gap-2">
            <Fieldset
              className="m-0 flex-grow-1"
              legend="Genomic Sequence"
              toggleable
              collapsed={false}
            >
              <div
                className="p-text-lowercase"
                style={{
                  maxWidth: "60vw",
                  fontFamily: "monospace",
                  wordWrap: "break-word",
                }}
              >
                {genomicSequenceData}
              </div>
            </Fieldset>
          </div>

          <div className="flex gap-2">
            <Fieldset
              className="m-0 flex-grow-1"
              legend="Protein Sequence"
              toggleable
              collapsed={false}
            >
              <div
                className="p-text-lowercase"
                style={{
                  maxWidth: "60vw",
                  fontFamily: "monospace",
                  wordWrap: "break-word",
                }}
              >
                {proteinSequenceData}
              </div>
            </Fieldset>
          </div>
        </div>

        <div className="flex flex-column gap-2">
          <div className="flex pt-2">
            <Fieldset className="m-0 flex-grow-1" legend="Coordinates">
              <DataTable
                value={coordinatesData}
                className="HideDataTableHeader"
              >
                <Column field="name"></Column>
                <Column field="value"></Column>
              </DataTable>
            </Fieldset>
          </div>

          <div className="flex pt-2">
            <Fieldset className="m-0 flex-grow-1" legend="Orthologs">
              <DataTable value={orthologsData} className="HideDataTableHeader">
                <Column field="name"></Column>
                <Column field="value"></Column>
              </DataTable>
            </Fieldset>
          </div>

          <div className="flex pt-2">
            <Fieldset className="m-0 flex-grow-1" legend="Protein Summary">
              <DataTable
                value={proteinSummaryData}
                className="HideDataTableHeader"
              >
                <Column field="name"></Column>
                <Column field="value"></Column>
              </DataTable>
            </Fieldset>
          </div>
          <div className="flex pt-2">
            <Fieldset className="m-0 flex-grow-1" legend="Gene Summary">
              <DataTable
                value={geneSummaryData}
                className="HideDataTableHeader"
              >
                <Column field="name"></Column>
                <Column field="value"></Column>
              </DataTable>
            </Fieldset>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(FGVPublic);
