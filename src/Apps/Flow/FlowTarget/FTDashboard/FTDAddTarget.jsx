import { Divider } from "primereact/divider";
import React from "react";
import { useNavigate } from "react-router-dom";
import { QuestionnaireIcon } from "../../../Questionnaire/icons/QuestionnaireIcon";

const FTDAddTarget = ({ closeSideBar }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-column gap-2 w-full">
      <div className="flex text-2xl">Available Methods</div>
      <div className="flex">
        The following methods are available to source a target
      </div>
      <div className="flex">
        <Divider />
      </div>
      <div
        className="flex flex-column gap-2 w-full border-1 border-200 pt-3 pb-3 pl-2 pr-2 justify-content-center cursor-pointer hover:shadow-1"
        onClick={() => {
          closeSideBar();
          navigate("sourcing/tpq/");
        }}
      >
        <div className="flex text-lg font-bold">
          <QuestionnaireIcon /> Target Promotion Questionnaire
        </div>
        <div className="flex">
          Answer a set of questions to identify a gene (protein) or a set of
          genes (protein complex) as a potential target.
        </div>
      </div>
    </div>
  );
};

export default FTDAddTarget;
