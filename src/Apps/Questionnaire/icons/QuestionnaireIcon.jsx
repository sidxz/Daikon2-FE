import React from "react";
import QuestionnaireSVG from "../../../assets/questionnaire/questionnaire.svg";
import "./QuestionnaireIcon.css";
export const QuestionnaireIcon = ({ size }) => {
  const width = size || "24px";
  const height = size || "24px";
  return (
    <div className="flex align-items-center ml-2 mr-2">
      <img
        src={QuestionnaireSVG}
        className="questionnaireIcon"
        alt="Questionnaire"
        width={width}
        height={height}
      />
    </div>
  );
};
