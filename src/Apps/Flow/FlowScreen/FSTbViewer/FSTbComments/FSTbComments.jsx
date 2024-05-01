import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import { Chip } from "primereact/chip";
import React from "react";
import { useNavigate } from "react-router-dom";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import { AppOrgResolver } from "../../../../../Shared/VariableResolvers/AppOrgResolver";
import { appColors } from "../../../../../constants/colors";
import AddComment from "../../../../Comments/AddComment/AddComment";
import CommentsByTags from "../../../../Comments/CommentsByTags/CommentsByTags";
import { ScreenIcon } from "../../../icons/ScreenIcon";
import { FormatScreeningMethod } from "../../shared/Formatters";

const FSTbComments = ({ selectedScreen }) => {
  console.log(selectedScreen);
  const navigate = useNavigate();
  const { getOrgNameById } = AppOrgResolver();
  const breadCrumbItems = [
    {
      label: "Screens",
      command: () => {
        navigate("/wf/screen/dash/");
      },
    },
    {
      label: "Target Based",
      command: () => {
        navigate("/wf/screen/dash/target-based/");
      },
    },
    {
      label: selectedScreen.name,
      command: () => {
        navigate(`/wf/screen/viewer/tb/${selectedScreen.id}`);
      },
    },
    { label: "Discussion" },
  ];

  let associatedTargetsArray = Object.keys(
    selectedScreen.associatedTargets
  ).map((key) => selectedScreen.associatedTargets[key]);

  return (
    <div className="flex flex-column w-full">
      <div className="flex w-full">
        <BreadCrumb model={breadCrumbItems} />
      </div>
      <div className="flex w-full">
        <SecHeading
          svgIcon={<ScreenIcon size={"25em"} />}
          heading={"Screen - " + selectedScreen.name}
          displayHorizon={true}
          entryPoint={selectedScreen?.id}
          color={appColors.sectionHeadingBg.screen}
          customElements={[
            <Chip
              label={FormatScreeningMethod(selectedScreen?.method)}
              icon="icon icon-common icon-circle-notch"
            />,
            <Chip
              label={getOrgNameById(selectedScreen?.primaryOrgId)}
              icon="ri-organization-chart"
              className="mr-3"
            />,
          ]}
        />
      </div>
      <div className="flex w-full pt-1">
        <AddComment
          resourceId={selectedScreen.id}
          tags={[...associatedTargetsArray, "Screen", selectedScreen.name]}
        />
      </div>
      <div className="flex w-full pt-1">
        <CommentsByTags
          tags={[...associatedTargetsArray, selectedScreen.name]}
        />
      </div>
    </div>
  );
};

export default observer(FSTbComments);
