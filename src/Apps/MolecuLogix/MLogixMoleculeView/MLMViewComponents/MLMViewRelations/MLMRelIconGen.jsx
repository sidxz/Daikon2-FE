import { HAIcon } from "../../../../Flow/icons/HAIcon";
import { HitCollectionIcon } from "../../../../Flow/icons/HitCollectionIcon";
import { PortfolioIcon } from "../../../../Flow/icons/PortfolioIcon";
import { PostPortfolioIcon } from "../../../../Flow/icons/PostPortfolioIcon";

export const generateIcon = (associations, nodeId) => {
  let item = associations.find((i) => i.id === nodeId);
  switch (item.nodeType) {
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
