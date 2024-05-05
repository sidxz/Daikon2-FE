import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import { Chip } from "primereact/chip";
import { Skeleton } from "primereact/skeleton";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import { AppOrgResolver } from "../../../../../Shared/VariableResolvers/AppOrgResolver";
import { appColors } from "../../../../../constants/colors";
import AddComment from "../../../../Comments/AddComment/AddComment";
import CommentsByTags from "../../../../Comments/CommentsByTags/CommentsByTags";
import ScreenViewAPI from "../../../FlowScreen/api/ScreenViewAPI";
import { HAIcon } from "../../../icons/HAIcon";
import HaStatusDropdown from "../../shared/HaStatusDropdown";

const FSTbComments = ({ selectedHa }) => {
  console.log(selectedHa);
  const navigate = useNavigate();

  const { getOrgNameById } = AppOrgResolver();

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

  console.log("screenTag", screenTag);

  const breadCrumbItems = [
    {
      label: "Sections",
      items: [
        {
          label: "HA Information",
          icon: "icon icon-common icon-circle-notch",
          command: () => {
            navigate("information/");
          },
        },
        {
          label: "Discussion",
          icon: "ri-discuss-line",
          command: () => {
            navigate("discussion/");
          },
        },
      ],
    },

    {
      label: "Admin Section",
      items: [
        {
          label: "Settings",
          icon: "pi pi-cog",
          command: () => {
            navigate("settings/");
          },
        },
      ],
    },
  ];

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
          customElements={[
            <HaStatusDropdown />,
            <Chip
              label={getOrgNameById(selectedHa?.primaryOrgId)}
              icon="ri-organization-chart"
              className="mr-3"
            />,
          ]}
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
