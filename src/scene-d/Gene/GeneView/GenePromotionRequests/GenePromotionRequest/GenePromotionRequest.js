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
    isFetchingQuestions,
    fetchQuestions,
    questionsRegistry,
    isCacheValid,
    getGenePromotionDataObj,
    isPromotionQuestionnaireSubmitting,
    submitPromotionQuestionnaire,
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
        questionId: QuestionsRegistry.get(key).id,
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

  /* Generate the user answered values */
  let userAnsweredQuestions = questions.map((question) => {
    return (
      <div className="flex flex-row p-3">
        <Question
          question={questionsRegistry.get(question.identification)}
          updateObject={(e) => updateTargetPromotionFormValue(e)}
          readObject={targetPromotionReviewFormValue}
        />
      </div>
    );
  });

  return (
    <div>
      <div className="p-d-flex p-flex-column">
        <div className="p-mr-2" style={{ minWidth: "1000px" }}>
          <Panel header="Summary" toggleable>
            <h4>
              Target Type :{" "}
              {userAnsweredTargetPromotionQuestionnaire.targetType}
            </h4>
            <h4>
              Target Name :{" "}
              {userAnsweredTargetPromotionQuestionnaire.targetName}
            </h4>
            <h4>Genes : {getGeneInformation()}</h4>
            <h4>
              Submitted by :{" "}
              {
                userAnsweredTargetPromotionQuestionnaire.answers[
                  Object.keys(
                    userAnsweredTargetPromotionQuestionnaire.answers
                  )[0]
                ]["answeredBy"]
              }
            </h4>
          </Panel>
          <br />
        </div>
        <div className="p-mr-2" style={{ minWidth: "1000px" }}>
          <Panel
            header="Submitted Promotion userAnsweredTargetPromotionQuestionnaire"
            toggleable
          >
            {userAnsweredQuestions}
            <Button
              label="Promote"
              className="p-button-success"
              style={{ float: "right" }}
              onClick={() => submitPromoteGeneForm()}
            />
          </Panel>
        </div>
      </div>
    </div>
  );
};

export default GenePromotionRequest;
