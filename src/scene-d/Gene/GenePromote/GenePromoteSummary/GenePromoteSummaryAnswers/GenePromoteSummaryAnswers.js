import React from "react";

/**
 * GenePromoteSummaryAnswers Component: Displays questions and their answers.
 * Highlights any missing answers or descriptions.
 *
 * @param {string} oKey - The object key for the current question.
 * @param {Map} questionObj - Map of questions.
 * @param {Object} ansObj - Object of answers and descriptions.
 */
const GenePromoteSummaryAnswers = ({ oKey, questionObj, ansObj }) => {
  // Check if the answer for the given key is missing.
  const isAnswerMissing = () => !ansObj[oKey]?.answer;

  // Check if the description for allowed answers is missing.
  const isDescriptionMissing = () => {
    const allowedAnswers = [
      "YES",
      "NO",
      "ACTIVE",
      "INACTIVE",
      "HIGH",
      "MEDIUM",
      "LOW",
    ];
    return (
      allowedAnswers.includes(ansObj[oKey]?.answer) &&
      !ansObj[oKey]?.description
    );
  };

  // Render the main component.
  return (
    <div className="flex align-content-center gap-2 mb-2 w-full">
      <div className="flex align-items-center w-4 pl-2 border-1 border-round">
        <p>
          <b>{oKey} | </b>
          {questionObj.get(oKey)?.questionBody}
        </p>
      </div>
      <div
        className={
          isAnswerMissing()
            ? "flex align-items-center w-2 pl-2 border-3 border-round border-red-500 surface-overlay"
            : "flex align-items-center w-2 pl-2 border-1 border-round"
        }
      >
        <p>{ansObj[oKey]?.answer}</p>
      </div>
      <div
        className={
          isDescriptionMissing()
            ? "flex align-items-center w-6 pl-2 border-3 border-round border-red-500 surface-overlay"
            : "flex align-items-center w-6 pl-2 border-1 border-round"
        }
        style={{ overflowWrap: "break-word" }}
      >
        <p style={{ overflowWrap: "break-word" }}>
          {isDescriptionMissing()
            ? "Description missing. Kindly provide more details in the form."
            : ansObj[oKey]?.description}
        </p>
      </div>
    </div>
  );
};

export default GenePromoteSummaryAnswers;
