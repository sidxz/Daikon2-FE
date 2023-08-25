import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import Question from "../../../../../../app/common/Question/Question";
import { RootStoreContext } from "../../../../../../app/stores/rootStore";

const GenePromoteQuestionnaireSubSection = ({
  subSection,
  updateTargetPromotionFormValue,
  targetPromotionFormValue,
}) => {
  const rootStore = useContext(RootStoreContext);

  const {
    questions,
    questionsGrouped,
    isFetchingQuestions,
    fetchQuestions,
    questionsRegistry,
    isCacheValid,
    getGenePromotionDataObj,
  } = rootStore.genePromotionStore;

  if (!subSection) {
    return null;
  }

  let subSectionQuestions = subSection.map((question) => {
    return (
      <div className="flex flex-row p-3">
        <Question
          question={questionsRegistry.get(question.identification)}
          updateObject={(e) => updateTargetPromotionFormValue(e)}
          readObject={targetPromotionFormValue}
        />
      </div>
    );
  });

  return (
    <div className="flex gap-1 flex-column p-3">
      <div className="flex flex-row text-lg	font-semibold">
        {subSection[0].subSection}
      </div>
      <div className="flex flex-row">{subSection[0].subSectionDescription}</div>
      {subSectionQuestions}
    </div>
  );
};

export default observer(GenePromoteQuestionnaireSubSection);
