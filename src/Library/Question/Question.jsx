import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Tooltip } from "primereact/tooltip";
import React from "react";

const Question = ({ question, updateObject, readObject, highlightRed }) => {
  if (typeof question?.identification === "undefined")
    return <React.Fragment />;

  let getBorderCssClass = () => {
    let borderCssClass = ["flex", "flex-wrap", "align-content-center", "gap-2"];
    if (highlightRed)
      borderCssClass = borderCssClass.concat([
        "border-1",
        "border-round",
        "border-red-500",
        "border-dashed",
        "surface-overlay",
      ]);
    return borderCssClass.join(" ");
  };

  const selectedOptionTemplate = (option, props) => {
    if (option) {
      return (
        <div className="flex flex-column max-w-30rem flex-wrap justify-content-center">
          {option.answer}
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const optionTemplate = (option) => {
    return (
      <div className="flex flex-column max-w-30rem flex-wrap">
        <div className="flex font-bold text-md border-400 p-0">
          {option.answer}
        </div>
        <div className="flex flex-wrap white-space-normal ml-4">
          {option.description}
        </div>
      </div>
    );
  };

  let cautionClass = () => {
    if (readObject?.[question.identification]?.answer !== "UNKNOWN") {
      if (readObject?.[question.identification]?.description === "") {
        return true;
      }
    }
    return false;
  };

  return (
    <div className={getBorderCssClass()}>
      <div className="flex align-items-center">
        <Tooltip
          target={".questionBody" + question.identification}
          content={question.toolTip}
          tooltipOptions={{ position: "top" }}
        />
        <div
          className={"questionBody" + question.identification}
          style={{ width: "19rem" }}
        >
          <b
            style={{
              backgroundColor: "#5D6D7E",
              color: "#ffffff",
              padding: "2px",
              marginRight: "4px",
            }}
          >
            {question.identification}
          </b>
          {question.questionBody}
        </div>
      </div>
      <div className="flex align-items-center">
        {question.questionType === "MultipleChoice" && (
          <Dropdown
            id={question.identification}
            style={{ width: "9rem", height: "3rem" }}
            options={question.possibleAnswers}
            valueTemplate={selectedOptionTemplate}
            itemTemplate={optionTemplate}
            value={readObject?.[question.identification]?.answer}
            optionLabel="answer"
            optionValue="answer"
            onChange={(e) => updateObject(e)}
          />
        )}
        {question.questionType === "Text" && (
          <InputText
            id={question.identification}
            style={{ width: "9rem", height: "3rem" }}
            value={readObject?.[question.identification]?.answer}
            optionLabel="answer"
            optionValue="answer"
            onChange={(e) => updateObject(e)}
          />
        )}
        {question.questionType === "" && (
          <InputText
            id={question.identification}
            style={{ width: "9rem", height: "3rem" }}
            value={readObject?.[question.identification]?.answer}
            optionLabel="answer"
            optionValue="answer"
            readOnly={true}
            onChange={(e) => updateObject(e)}
          />
        )}
      </div>
      <div className="flex align-items-center">
        <span className="float-label">
          <InputTextarea
            rows={1}
            style={{ minWidth: "40rem", minHeight: "2.9rem" }}
            id={question.identification + "Description"}
            value={readObject?.[question.identification]?.description || ""}
            onChange={(e) => updateObject(e)}
            placeholder={
              cautionClass()
                ? "Description is required*. Click to edit"
                : "Description"
            }
            className={cautionClass() ? "border-red-500" : ""}
          />
        </span>
      </div>
    </div>
  );
};

export default Question;
