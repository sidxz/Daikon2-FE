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
import { HAIcon } from "../../../icons/HAIcon";
import { HaAdminRoleName } from "../../constants/roles";
import HaStatusDropdown from "../../shared/HaStatusDropdown";

const FSTbComments = ({ selectedHa }) => {
  //console.log(selectedHa);
  const navigate = useNavigate();

  const { getOrgNameById } = AppOrgResolver();
  const { isUserInAnyOfRoles } = AppRoleResolver();

  let [screenTag, setScreenTag] = useState(null);
  let [isScreenTagFetched, setIsScreenTagFetched] = useState(false);

  let hitId = selectedHa.hitId;

  if (hitId !== undefined) {
    ScreenViewAPI.hitView(hitId).then((res) => {
      setScreenTag(res.screenName);
      setIsScreenTagFetched(true);
    });
  } else {
    setIsScreenTagFetched(true);
  }

  //console.log("screenTag", screenTag);

  const breadCrumbItems = [
    {
      label: "HAs",
      command: () => {
        navigate("/wf/ha/");
      },
    },
    {
      label: selectedHa.name,
      command: () => {
        navigate(`/wf/ha/viewer/${selectedHa.id}`);
      },
    },
    { label: "Discussion" },
  ];

  var titleBarButtons = [];

  if (isUserInAnyOfRoles([HaAdminRoleName])) {
    titleBarButtons.push(<HaStatusDropdown />);
  } else {
    titleBarButtons.push(
      <HaStatusDropdown readOnly={true} readOnlyStatus={selectedHa.status} />
    );
  }

  titleBarButtons.push(
    <Chip
      label={getOrgNameById(selectedHa?.primaryOrgId)}
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
          svgIcon={<HAIcon size={"25em"} />}
          heading={"Hit Assessment - " + selectedHa.name}
          displayHorizon={true}
          color={appColors.sectionHeadingBg.ha}
          entryPoint={selectedHa?.id}
          customElements={titleBarButtons}
        />
      </div>
      <div className="flex w-full pt-1">
        {isScreenTagFetched ? (
          <AddComment
            resourceId={selectedHa.id}
            tags={["HA", selectedHa.name].concat(screenTag ? [screenTag] : [])}
          />
        ) : (
          <Skeleton height="2rem" className="mb-2"></Skeleton>
        )}
      </div>
      <div className="flex w-full pt-1">
        <CommentsByTags tags={[selectedHa.name]} />
      </div>
    </div>
  );
};

export default observer(FSTbComments);
