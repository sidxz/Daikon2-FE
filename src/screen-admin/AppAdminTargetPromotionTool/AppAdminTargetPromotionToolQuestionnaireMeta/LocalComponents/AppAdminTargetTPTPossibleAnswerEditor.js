import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import React from "react";

const AppAdminTargetTPTPossibleAnswerEditor = ({ handleChange, answers }) => {
  return (
    <div>
      {answers.map(({ id, answer, description }) => (
        <div key={id} className="flex flex-row w-full align-items-center gap-2">
          <div className="flex w-3">
            <InputText
              id={id.toString()}
              name="answer"
              readOnly={true}
              value={answer}
              onChange={handleChange}
              style={{ width: "100%" }}
            />
          </div>
          <div className="flex w-9">
            <InputTextarea
              id={id.toString()}
              className="w-full m-1"
              name="description"
              value={description}
              onChange={handleChange}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppAdminTargetTPTPossibleAnswerEditor;
