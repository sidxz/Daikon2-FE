import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import React from "react";
import { useNavigate } from "react-router-dom";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import { appColors } from "../../../../../constants/colors";
import AddComment from "../../../../Comments/AddComment/AddComment";
import CommentsByTags from "../../../../Comments/CommentsByTags/CommentsByTags";
import { GeneIcon } from "../../../icons/GeneIcon";

const FGVComments = ({ selectedGene }) => {
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
    { label: "Discussion" },
  ];

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
      <div className="flex w-full pt-1">
        <AddComment
          resourceId={selectedGene.id}
          tags={["Gene", selectedGene.accessionNumber, selectedGene?.name]}
        />
      </div>
      <div className="flex w-full pt-1">
        <CommentsByTags
          tags={[selectedGene.accessionNumber, selectedGene?.name]}
        />
      </div>
    </div>
  );
};

export default observer(FGVComments);
