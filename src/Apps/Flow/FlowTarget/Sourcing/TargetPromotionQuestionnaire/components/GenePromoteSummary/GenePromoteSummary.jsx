import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import React from "react";
import GenePromoteSummaryAnswers from "./GenePromoteSummaryAnswers/GenePromoteSummaryAnswers";

const GenePromoteSummary = (props) => {
  let allQuestions = props.questions.map((q) => {
    return (
      <GenePromoteSummaryAnswers
        oKey={q.identification}
        questionObj={props.promotionQuestionsRegistry}
        ansObj={props.targetPromotionFormValue}
      />
    );
  });

  return (
    <React.Fragment>
      <div className="flex flex-column w-full">
        <div className="flex">
          <h2>Submit For Review</h2>
        </div>

        <div className="flex flex-column">{allQuestions}</div>
        <div className="flex flex-column">
          <Divider />
        </div>

        <div className="flex justify-content-end">
          <div className="flex">
            <Button
              label="Submit"
              icon="pi pi-arrow-right"
              className="p-button-success"
              readOnly={props.isPromotionQuestionnaireSubmitting}
              loading={props.isPromotionQuestionnaireSubmitting}
              onClick={() => {
                props.submitTargetPromotionFormValueForm();
              }}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default observer(GenePromoteSummary);
