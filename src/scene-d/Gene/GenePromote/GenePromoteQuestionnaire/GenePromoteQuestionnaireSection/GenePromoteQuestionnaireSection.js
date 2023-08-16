import { observer } from "mobx-react-lite";
import React from "react";
import GenePromoteQuestionnaireSubSection from "./GenePromoteQuestionnaireSubSection/GenePromoteQuestionnaireSubSection";

const GenePromoteQuestionnaireSection = ({
  section,
  updateTargetPromotionFormValue,
  targetPromotionFormValue,
}) => {
  if (!section) return null;

  let subSections = [];

  for (let subSection in section) {
    if (section.hasOwnProperty(subSection)) {
      // It's a good practice to check if the key is a direct property of the object
      console.log(subSection, section[subSection]);
      subSections.push(
        <div className="flex flex-row p-1">
          <GenePromoteQuestionnaireSubSection
            subSection={section[subSection]}
            updateTargetPromotionFormValue={updateTargetPromotionFormValue}
            targetPromotionFormValue={targetPromotionFormValue}
          />
        </div>
      );
    }
  }

  return (
    <div className="flex flex-column p-3">
      <div className="flex flex-column p-1">{subSections}</div>
    </div>
  );
};

export default observer(GenePromoteQuestionnaireSection);
