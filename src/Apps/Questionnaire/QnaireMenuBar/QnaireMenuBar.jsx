import { observer } from "mobx-react-lite";
import React from "react";
import { NavLink } from "react-router-dom";
import { QuestionnaireIcon } from "../icons/QuestionnaireIcon";
const QnaireMenuBar = () => {
  return (
    <div className="flex w-full bg-blue-100 gap-4 align-items-center">
      <div className="flex p-2">
        <QuestionnaireIcon size="50em" />
      </div>
      <div className="=flex text-4xl ">
        <NavLink to="/questionnaire" className="text-900 no-underline">
          Questionnaires
        </NavLink>{" "}
      </div>
    </div>
  );
};

export default observer(QnaireMenuBar);
