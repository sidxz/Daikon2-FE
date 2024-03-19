import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Steps } from "primereact/steps";
import React, { useContext, useEffect, useState } from "react";
import { RootStoreContext } from "../../../../../../../RootStore";
import GenePromoteQuestionnaireSection from "./GenePromoteQuestionnaireSection/GenePromoteQuestionnaireSection";

const GenePromoteQuestionnaire = ({
  proposedTargetName,
  updateTargetPromotionFormValue,
  saveFormToLocalStorage,
  resetFormLocalStorage,
  targetPromotionFormValue,
  showSummary,
}) => {
  const [activeIndexStepsModule, setActiveIndexStepsModule] = useState(0);

  const rootStore = useContext(RootStoreContext);

  const {
    questions,
    questionsGrouped,
    isFetchingQuestions,
    fetchQuestions,
    questionsRegistry,
    isCacheValid,
    getGenePromotionDataObj,
  } = rootStore.targetSourcingStore;

  useEffect(() => {
    if (!isCacheValid) {
      fetchQuestions();
    }
  }, [isCacheValid, fetchQuestions]);

  let sectionNames = Object.keys(questionsGrouped);
  const [activeSection, setActiveSection] = useState(sectionNames[0]);

  let sections = sectionNames.map((sectionName) => {
    function extractSectionName(str) {
      const regex = /Section \d+: (.*)/;
      const match = str.match(regex);

      return match ? match[1] : null;
    }

    return {
      label: extractSectionName(sectionName),
    };
  });

  if (!proposedTargetName) {
    return <div>Proposed Target Name is required</div>;
  }

  // Helper function to navigate to the next section
  const goToNextSection = () => {
    if (activeIndexStepsModule < sectionNames.length - 1) {
      const newIndex = activeIndexStepsModule + 1;
      setActiveIndexStepsModule(newIndex);
      setActiveSection(sectionNames[newIndex]);
      window.scrollTo(0, 0);
    }
  };

  // Helper function to navigate to the previous section
  const goToPreviousSection = () => {
    if (activeIndexStepsModule > 0) {
      const newIndex = activeIndexStepsModule - 1;
      setActiveIndexStepsModule(newIndex);
      setActiveSection(sectionNames[newIndex]);
      window.scrollTo(0, 0);
    }
  };

  return (
    <React.Fragment>
      <div className="flex flex-column w-full">
        <div className="flex w-full">
          <Steps
            model={sections}
            activeIndex={activeIndexStepsModule}
            onSelect={(e) => {
              setActiveIndexStepsModule(e.index);
              setActiveSection(sectionNames[e.index]);
            }}
            readOnly={false}
            className="w-full"
          />
        </div>
        <div className="flex w-full mt-3 border-top-1">
          <GenePromoteQuestionnaireSection
            section={questionsGrouped[activeSection]}
            updateTargetPromotionFormValue={updateTargetPromotionFormValue}
            saveFormToLocalStorage={saveFormToLocalStorage}
            resetFormLocalStorage={resetFormLocalStorage}
            targetPromotionFormValue={targetPromotionFormValue}
          />
        </div>
        <div className="flex w-full justify-content-end gap-2 pr-8">
          <div className="flex">
            <Button
              label="Previous Section"
              className="p-button-secondary"
              onClick={goToPreviousSection}
              disabled={activeIndexStepsModule == 0}
            />
          </div>
          <div className="flex">
            {activeIndexStepsModule == sectionNames.length - 1 ? (
              <Button
                label="Review"
                className="p-button-secondary"
                onClick={() => showSummary()}
              />
            ) : (
              <Button
                label="Next Section"
                className="p-button-secondary"
                onClick={goToNextSection}
              />
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default observer(GenePromoteQuestionnaire);
