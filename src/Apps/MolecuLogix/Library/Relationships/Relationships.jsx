import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { AppOrgResolver } from "../../../../Shared/VariableResolvers/AppOrgResolver";
import { HAIcon } from "../../../Flow/icons/HAIcon";
import { HitCollectionIcon } from "../../../Flow/icons/HitCollectionIcon";
import { PortfolioIcon } from "../../../Flow/icons/PortfolioIcon";
import { PostPortfolioIcon } from "../../../Flow/icons/PostPortfolioIcon";

let generateIcon = (nodeType) => {
  switch (nodeType) {
    case "HitCollection": {
      return <HitCollectionIcon size={"25em"} />;
    }
    case "HitAssessment":
      return <HAIcon size={"25em"} />;

    case "Project": {
      const portfolioType = ["IND", "P1"].includes(item.nodeProperties.stage)
        ? "pp"
        : "p";
      if (portfolioType === "pp") {
        return <PostPortfolioIcon size={"25em"} />;
      }
      return <PortfolioIcon size={"25em"} />;
    }

    default:
      return <></>;
  }
};

export const generateLink = (node) => {
  switch (node.nodeType) {
    case "HitCollection": {
      console.log("node.nodeProperties: ", node.properties);
      const screenType =
        node.nodeProperties.screenType === "target-based" ? "tb" : "ph";
      return `/wf/screen/viewer/${screenType}/${node.nodeProperties.screenId}/hits/${node.nodeProperties.uniId}`;
    }
    case "HitAssessment":
      return `/wf/ha/viewer/${node.nodeProperties.uniId}/`;

    case "Project": {
      const portfolioType = ["IND", "P1"].includes(node.nodeProperties.stage)
        ? "post-portfolio"
        : "portfolio";
      return `/wf/${portfolioType}/viewer/${node.nodeProperties.uniId}/`;
    }

    default:
      return "/";
  }
};

const Relationships = ({ associations, showIcon = false }) => {
  const { getOrgAliasById } = AppOrgResolver();
  const navigate = useNavigate();
  const propertiesToInclude = [
    "stage",
    "screenType",
    "status",
    "orgId",
    "relationship",
  ];

  if (!associations || associations.length === 0) {
    return <div className="flex">No relationships found</div>;
  }

  let data = associations.map((item) => {
    const filteredProperties = _.pick(item.nodeProperties, propertiesToInclude);
    // check if filteredProperties has orgId
    if (filteredProperties.orgId) {
      filteredProperties.org = getOrgAliasById(filteredProperties.orgId);
      // remove orgId from filteredProperties
      delete filteredProperties.orgId;
    }
    const propertiesArray = Object.keys(filteredProperties).map((key) => ({
      name: _.startCase(key),
      value: _.startCase(filteredProperties[key]),
    }));
    return {
      nodeType: item.nodeType,
      nodeRelation: item.nodeRelation,
      nodeName: item.nodeName,
      uniId: item.nodeProperties.uniId,
      properties: propertiesArray,
      nodeProperties: item.nodeProperties,
    };
  });

  let dataView = data.map((item) => {
    return (
      <div
        className="flex gap-2 w-full cursor-pointer"
        key={item.uniId + item.nodeRelation}
        onClick={() => {
          navigate(generateLink(item));
        }}
      >
        {showIcon && (
          <div className="flex border-circle w-3rem h-3rem m-2 align-items-left justify-content-center flex-column gap-1">
            <div className="flex">{generateIcon(item.nodeType)}</div>
            {/* <div className="flex text-sm">{node.nodeType}</div> */}
          </div>
        )}
        <div className="flex flex-column">
          <div className="flex pt-2 text-lg text-100 text-black-alpha-90 justify-content-left">
            {item.nodeName}
          </div>
          <div className="flex p-0 text-sm text-100 text-black-alpha-50 justify-content-left">
            {/* {_.startCase(node.nodeRelation.toLowerCase())} */}
            {_.startCase(item.nodeType)}
          </div>
        </div>
      </div>
    );
  });

  return <div className="fle flex-column w-full gap-1">{dataView}</div>;
};

export default Relationships;
