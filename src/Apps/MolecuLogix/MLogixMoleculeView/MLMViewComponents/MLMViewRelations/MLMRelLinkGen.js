export const generateLink = (associations, nodeId) => {
  let item = associations.find((i) => i.id === nodeId);
  switch (item.nodeType) {
    case "HitCollection": {
      const screenType =
        item.nodeProperties.screenType === "target-based" ? "tb" : "ph";
      return `/wf/screen/viewer/${screenType}/${item.nodeProperties.screenId}/hits/${item.nodeProperties.uniId}`;
    }
    case "HitAssessment":
      return `/wf/ha/viewer/${item.nodeProperties.uniId}/`;

    case "Project": {
      const portfolioType = ["IND", "P1"].includes(item.nodeProperties.stage)
        ? "post-portfolio"
        : "portfolio";
      return `/wf/${portfolioType}/viewer/${item.nodeProperties.uniId}/`;
    }

    default:
      return "/";
  }
};
