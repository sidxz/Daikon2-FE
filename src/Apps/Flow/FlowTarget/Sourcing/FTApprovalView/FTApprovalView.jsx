import { observer } from "mobx-react-lite";
import { Divider } from "primereact/divider";
import { Panel } from "primereact/panel";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../../../../Library/Loading/Loading";
import Question from "../../../../../Library/Question/Question";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../../../RootStore";
import { appColors } from "../../../../../constants/colors";
import { TargetIcon } from "../../../icons/TargetIcon";

const FTApprovalView = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    fetchTQ,
    isFetchingTQ,
    isTQXVerifiedCacheValid,
    TQUnapproved,
    selectedTQ,
  } = rootStore.targetPQStore;
  const { isGeneListCacheValid, isGeneListLoading, geneList, fetchGenes } =
    rootStore.geneStore;
  const {
    questions,
    questionsGrouped,
    isFetchingQuestions,
    fetchQuestions,
    questionsRegistry,
    isCacheValid,
    getGenePromotionDataObj,
    submitPromotionQuestionnaire,
  } = rootStore.targetSourcingStore;

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (!isGeneListCacheValid) {
      fetchGenes();
    }
  }, [isGeneListCacheValid, fetchGenes]);

  useEffect(() => {
    if (!isCacheValid) {
      fetchQuestions();
    }
  }, [isCacheValid, fetchQuestions]);

  useEffect(() => {
    if (selectedTQ === null || selectedTQ.id !== params.id) {
      fetchTQ(params.id);
    }
  }, [fetchTQ, isTQXVerifiedCacheValid, params.id, selectedTQ]);

  const [targetPromotionFormValue, setTargetPromotionFormValue] = useState({});

  if (isFetchingTQ || isGeneListLoading || isFetchingQuestions) {
    return <Loading message={"Fetching Questionnaire..."} />;
  }

  if (
    !isFetchingQuestions &&
    questionsRegistry.size > 0 &&
    Object.keys(targetPromotionFormValue).length === 0 &&
    selectedTQ.response.length > 0
  ) {
    console.log("Set Now");
    let loadFormValue = questions?.reduce((acc, question) => {
      let ansItem = selectedTQ?.response.find(
        (obj) => obj.item1 === question.identification
      );

      // If ansItem is not found, skip this iteration
      if (!ansItem) return acc;

      acc[ansItem.item1] = {
        answer: ansItem.item2,
        description: ansItem.item3,
      };
      return acc;
    }, {});

    console.log("loadFormValue");
    console.log(loadFormValue);
    setTargetPromotionFormValue(loadFormValue);
  }

  const updateTargetPromotionFormValue = (e) => {
    //console.log(e);
    var location = null;
    var newFormValue = null;
    var newField = null;

    if (e.target.id.endsWith("Description")) {
      location = e.target.id.slice(0, -11);
      newFormValue = { ...targetPromotionFormValue };
      newField = { ...newFormValue[location] };
      newField.description = e.target.value;
      newFormValue[location] = newField;
      setTargetPromotionFormValue(newFormValue);
    } else {
      location = e.target.id;
      newFormValue = { ...targetPromotionFormValue };
      newField = { ...newFormValue[location] };
      newField.answer = e.target.value;
      newFormValue[location] = newField;
      setTargetPromotionFormValue(newFormValue);
    }
  };

  /* Generate the user answered question section */
  let userAnsweredQuestionsGrouped_Render = [];
  for (var section in questionsGrouped) {
    // Extract top level sections
    userAnsweredQuestionsGrouped_Render.push(
      <div className="flex w-full">
        <Divider align="left" className="text-xl font-bold">
          {section}
        </Divider>
      </div>
    );
    for (var subSection in questionsGrouped[section]) {
      // Extract sub sections
      userAnsweredQuestionsGrouped_Render.push(
        <div className="flex flex-column ml-6 gap-1">
          <div className="flex">
            <Divider align="left" type="dotted" className="text-lg font-bold">
              {subSection}
            </Divider>
          </div>
          <div className="flex text-sm p-2">
            {questionsGrouped[section][subSection][0]["subSectionDescription"]}
          </div>
        </div>
      );

      // extract questions from subsections, use map as it is an array
      questionsGrouped[section][subSection].map((subSectionQuestion) => {
        userAnsweredQuestionsGrouped_Render.push(
          <div className="flex flex-column ml-8 gap-1 pb-2">
            <Question
              question={questionsRegistry.get(
                subSectionQuestion.identification
              )}
              updateObject={(e) => updateTargetPromotionFormValue(e)}
              readObject={targetPromotionFormValue}
            />
          </div>
        );
      });
    }
  }

  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500">
      <div className="flex w-full">
        <SecHeading
          svgIcon={<TargetIcon size={"25em"} />}
          heading={
            "Target Awaiting Approval ( " +
            selectedTQ?.requestedTargetName +
            " )"
          }
          color={appColors.sectionHeadingBg.target}
          displayHorizon={false}
        />
      </div>
      <div className="flex w-full flex-column pl-2 m-2">
        <Panel
          header="Target Promotion Questionnaire (User's Submission)"
          className="w-full"
        >
          {userAnsweredQuestionsGrouped_Render}
        </Panel>
      </div>
    </div>
  );
};

export default observer(FTApprovalView);
