import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import { Chip } from "primereact/chip";
import { Skeleton } from "primereact/skeleton";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import { AppOrgResolver } from "../../../../../Shared/VariableResolvers/AppOrgResolver";
import { AppRoleResolver } from "../../../../../Shared/VariableResolvers/AppRoleResolver";
import { appColors } from "../../../../../constants/colors";
import AddComment from "../../../../Comments/AddComment/AddComment";
import CommentsByTags from "../../../../Comments/CommentsByTags/CommentsByTags";
import ScreenViewAPI from "../../../FlowScreen/api/ScreenViewAPI";
import { PostPortfolioIcon } from "../../../icons/PostPortfolioIcon";
import { PostPortfolioAdminRoleName } from "../../constants/roles";
import PostPortfolioStageDropdown from "../../shared/PostPortfolioStageDropdown";

const FPPVComments = ({ selectedProject }) => {
  console.log(selectedProject);
  const navigate = useNavigate();

  const { getOrgNameById } = AppOrgResolver();
  const { isUserInAnyOfRoles } = AppRoleResolver();

  let [screenTag, setScreenTag] = useState(null);
  let [isScreenTagFetched, setIsScreenTagFetched] = useState(false);

  if (selectedProject.hitId !== undefined) {
    ScreenViewAPI.hitView(selectedProject.hitId).then((res) => {
      setScreenTag(res.screenName);
      setIsScreenTagFetched(true);
    });
  }

  console.log("screenTag", screenTag);

  const breadCrumbItems = [
    {
      label: "Post Portfolios",
      command: () => {
        navigate("/wf/post-portfolio/");
      },
    },
    {
      label: selectedProject.name,
      command: () => {
        navigate(`/wf/post-portfolio/viewer/${selectedProject.id}`);
      },
    },
    { label: "Discussion" },
  ];

  var titleBarButtons = [];

  if (isUserInAnyOfRoles([PostPortfolioAdminRoleName])) {
    titleBarButtons.push(<PostPortfolioStageDropdown />);
  } else {
    titleBarButtons.push(
      <PostPortfolioStageDropdown
        readOnly={true}
        readOnlyStage={selectedProject.stage}
      />
    );
  }

  titleBarButtons.push(
    <Chip
      label={getOrgNameById(selectedProject?.primaryOrgId)}
      icon="ri-organization-chart"
      className="mr-3"
    />
  );

  return (
    <div className="flex flex-column w-full">
      <div className="flex w-full">
        <BreadCrumb model={breadCrumbItems} />
      </div>
      <div className="flex w-full">
        <SecHeading
          svgIcon={<PostPortfolioIcon size={"25em"} />}
          heading={"Post Portfolio - " + selectedProject.name}
          displayHorizon={true}
          color={appColors.sectionHeadingBg.project}
          entryPoint={selectedProject?.id}
          customElements={titleBarButtons}
        />
      </div>
      <div className="flex w-full pt-1">
        {isScreenTagFetched ? (
          <AddComment
            resourceId={selectedProject.id}
            tags={[selectedProject.stage, selectedProject.name].concat(
              screenTag ? [screenTag] : []
            )}
          />
        ) : (
          <Skeleton height="2rem" className="mb-2"></Skeleton>
        )}
      </div>
      <div className="flex w-full pt-1">
        {isScreenTagFetched ? (
          <CommentsByTags
            tags={[selectedProject.name].concat(screenTag ? [screenTag] : [])}
          />
        ) : (
          <Skeleton height="2rem" className="mb-2"></Skeleton>
        )}
      </div>
    </div>
  );
};

export default observer(FPPVComments);
