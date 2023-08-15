import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import React from "react";

const AppAdminTargetTPTPossibleAnswerEditor = ({ handleChange, answers }) => {
  const andWithDescEditor = (rowData) => {
    return (
      <div className="flex flex-row w-full align-items-center gap-2">
        <div className="flex w-3">
          <InputText
            id={rowData.id.toString()} // Convert id to string to match the event's target id type
            name="answer"
            readOnly={true}
            value={rowData.answer}
            onChange={handleChange}
            style={{ width: "100%" }}
          />
        </div>
        <div className="flex w-9">
          <InputTextarea
            id={rowData.id.toString()}
            className="w-full m-1"
            name="description"
            value={rowData.description}
            onChange={handleChange}
            style={{ width: "100%" }}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      {answers.map((answer) => {
        return andWithDescEditor(answer);
      })}
    </div>
  );
};

export default AppAdminTargetTPTPossibleAnswerEditor;
