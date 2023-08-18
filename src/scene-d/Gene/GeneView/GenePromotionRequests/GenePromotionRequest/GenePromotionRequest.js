import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import Question from "../../../../../app/common/Question/Question";
import Loading from "../../../../../app/layout/Loading/Loading";
import { RootStoreContext } from "../../../../../app/stores/rootStore";

const GenePromotionRequest = ({
  GenePromotionRequest,
  TargetName,
  AnswerRegistry,
  QuestionsRegistry,
  GeneRegistry,
}) => {
  const rootStore = useContext(RootStoreContext);

  const { displayLoading, genePromotionRegistry, promoteGene } =
    rootStore.geneStoreAdmin;

  const {
    questions,
    adminQuestions,
    isFetchingQuestions,
    fetchQuestions,
    questionsRegistry,
    adminQuestionsRegistry,
    isCacheValid,
    questionsGrouped,
    adminQuestionsGrouped,
  } = rootStore.genePromotionStore;

  useEffect(() => {
    if (!isCacheValid) {
      fetchQuestions();
    }

    return () => {
      //cleanup
    };
  }, [isCacheValid, fetchQuestions]);

  const userAnsweredTargetPromotionQuestionnaire =
    AnswerRegistry.get(TargetName);

  const [targetPromotionReviewFormValue, setTargetPromotionReviewFormValue] =
    useState(userAnsweredTargetPromotionQuestionnaire.answers);

  const updateTargetPromotionFormValue = (e) => {
    console.log(e);
    var location = null;
    var newFormValue = null;
    var newField = null;

    if (e.target.id.endsWith("Description")) {
      location = e.target.id.slice(0, -11);
      newFormValue = { ...targetPromotionReviewFormValue };
      newField = { ...newFormValue[location] };
      newField.description = e.target.value;
      newFormValue[location] = newField;
      setTargetPromotionReviewFormValue(newFormValue);
    } else {
      location = e.target.id;
      newFormValue = { ...targetPromotionReviewFormValue };
      newField = { ...newFormValue[location] };
      newField.answer = e.target.value;
      newFormValue[location] = newField;
      setTargetPromotionReviewFormValue(newFormValue);
    }
  };

  if (displayLoading) {
    return <Loading />;
  }

  const submitPromoteGeneForm = () => {
    var promotionReqData = {
      targetName: GenePromotionRequest.targetName,
      targetType: GenePromotionRequest.targetType,
      genePromotionRequestGenes: GenePromotionRequest.genePromotionRequestGenes,

      genePromotionRequestValues: [],
    };

    Object.keys(targetPromotionReviewFormValue).map((key) => {
      promotionReqData.genePromotionRequestValues.push({
        questionId: QuestionsRegistry.get(key)
          ? QuestionsRegistry.get(key).id
          : adminQuestionsRegistry.get(key).id,
        answer: targetPromotionReviewFormValue[key].answer,
        description: targetPromotionReviewFormValue[key].description,
      });
    });

    promoteGene(promotionReqData).then((res) => {
      if (res?.id) {
        toast.success("Success. The gene has been promoted.");
        genePromotionRegistry.delete(TargetName);
      }
    });
  };

  const getGeneInformation = () => {
    console.log("f -> getGeneInformation()");
    if (!userAnsweredTargetPromotionQuestionnaire.genePromotionRequestGenes) {
      return <h2>Failed. No Genes</h2>;
    } else {
      let genes =
        userAnsweredTargetPromotionQuestionnaire.genePromotionRequestGenes.map(
          (gene) => {
            return (
              <NavLink to={`/d/gene/${gene.geneId}`}>
                {GeneRegistry.get(gene.geneId).accessionNumber + " "}
              </NavLink>
            );
          }
        );

      return <React.Fragment>{genes}</React.Fragment>;
    }
  };

  /* Generate the user answered question section */
  let userAnsweredQuestionsGrouped_Render = [];
  for (var section in questionsGrouped) {
    // Extract top level sections
    userAnsweredQuestionsGrouped_Render.push(
      <div className="flex text-xl">{section}</div>
    );
    for (var subSection in questionsGrouped[section]) {
      // Extract sub sections
      userAnsweredQuestionsGrouped_Render.push(
        <div className="flex flex-column ml-2 gap-1">
          <div className="flex text-lg">{subSection}</div>
          <div className="flex text-sm p-2">
            {questionsGrouped[section][subSection][0]["subSectionDescription"]}
          </div>
        </div>
      );

      // extract questions from subsections, use map as it is an array
      questionsGrouped[section][subSection].map((subSectionQuestion) => {
        userAnsweredQuestionsGrouped_Render.push(
          <div className="flex flex-column ml-4 gap-1">
            <Question
              question={questionsRegistry.get(
                subSectionQuestion.identification
              )}
              updateObject={(e) => updateTargetPromotionFormValue(e)}
              readObject={targetPromotionReviewFormValue}
            />
          </div>
        );
      });
    }
  }

  /* Generate the admin question section */
  let adminQuestionsGrouped_Render = [];
  for (var section in adminQuestionsGrouped) {
    // Extract top level sections
    adminQuestionsGrouped_Render.push(
      <div className="flex text-xl">{section}</div>
    );
    for (var subSection in adminQuestionsGrouped[section]) {
      // Extract sub sections
      adminQuestionsGrouped_Render.push(
        <div className="flex flex-column ml-2 gap-1">
          <div className="flex text-lg">{subSection}</div>
          <div className="flex text-sm p-2">
            {
              adminQuestionsGrouped[section][subSection][0][
                "subSectionDescription"
              ]
            }
          </div>
        </div>
      );

      // extract questions from subsections, use map as it is an array
      adminQuestionsGrouped[section][subSection].map((subSectionQuestion) => {
        adminQuestionsGrouped_Render.push(
          <div className="flex flex-column ml-4 gap-1">
            <Question
              question={adminQuestionsRegistry.get(
                subSectionQuestion.identification
              )}
              updateObject={(e) => updateTargetPromotionFormValue(e)}
              readObject={targetPromotionReviewFormValue}
            />
          </div>
        );
      });
    }
  }

  return (
    <div className="flex flex-column gap-2">
      <div className="flex w-full">
        <Panel className="w-full" header="Summary" toggleable>
          <h4>
            Target Type : {userAnsweredTargetPromotionQuestionnaire.targetType}
          </h4>
          <h4>
            Target Name : {userAnsweredTargetPromotionQuestionnaire.targetName}
          </h4>
          <h4>Genes : {getGeneInformation()}</h4>
          <h4>
            Submitted by :{" "}
            {
              userAnsweredTargetPromotionQuestionnaire.answers[
                Object.keys(userAnsweredTargetPromotionQuestionnaire.answers)[0]
              ]["answeredBy"]
            }
          </h4>
        </Panel>
      </div>
      <div className="flex w-full" style={{ minWidth: "1000px" }}>
        <Panel className="w-full" header="User Questionnaire" toggleable>
          <div className="flex flex-column gap-2">
            {userAnsweredQuestionsGrouped_Render}
          </div>
        </Panel>
      </div>

      <div className="flex w-full" style={{ minWidth: "1000px" }}>
        <Panel className="w-full" header="Admin Questionnaire" toggleable>
          <div className="flex flex-column gap-2">
            {adminQuestionsGrouped_Render}
          </div>
        </Panel>
      </div>

      <div className="flex w-full justify-content-end border-200 surface-ground	 mt-2 p-2">
        <Button
          label="Promote Target"
          className="p-button-success"
          onClick={() => submitPromoteGeneForm()}
        />
      </div>
    </div>
  );
};

export default GenePromotionRequest;
