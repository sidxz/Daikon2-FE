export function _defaultFormData(promotionQuestionsRegistry) {
  let formData = {};

  let containsUnknownAsAnswer = (question) => {
    if (!question.possibleAnswerWithDesc) {
      return "false";
    }
    return question.possibleAnswerWithDesc.some(
      (answerObj) => answerObj.answer === "UNKNOWN"
    );
  };

  promotionQuestionsRegistry.forEach((value, key) => {
    formData[key] = {
      answer: containsUnknownAsAnswer(value) ? "UNKNOWN" : "",
      description: "",
    };
  });

  // formData = {
  //   "2a1": { answer: "", description: "" },
  //   "2a1b": { answer: "", description: "" },
  //   "2a2": { answer: "", description: "" },
  //   "2a3a": { answer: "", description: "" },
  //   "2a3b": { answer: "", description: "" },
  //   "2a4a": { answer: "", description: "" },
  //   "2a5": { answer: "", description: "" },
  //   "2b1": { answer: "", description: "" },
  //   "2b2": { answer: "", description: "" },
  //   "2b4": { answer: "", description: "" },
  //   "2c1": { answer: "", description: "" },
  //   "2c2": { answer: "", description: "" },
  //   "2c3": { answer: "", description: "" },
  //   "2c4": { answer: "", description: "" },
  //   "2c5": { answer: "", description: "" },
  //   "3a1": { answer: "", description: "" },
  //   "3a2": { answer: "", description: "" },
  //   "3a3": { answer: "", description: "" },
  //   "3a4": { answer: "", description: "" },
  //   "3b1": { answer: "", description: "" },
  //   "3b2": { answer: "", description: "" },
  //   "4a1": { answer: "", description: "" },
  //   "4a2a": { answer: "", description: "" },
  //   "4a2b": { answer: "", description: "" },
  //   "4a3a": { answer: "", description: "" },
  //   "4a3b": { answer: "", description: "" },
  //   "4a4": { answer: "", description: "" },
  //   "4b1": { answer: "", description: "" },
  //   "4b2": { answer: "", description: "" },
  //   "4b3": { answer: "", description: "" },
  //   "4c1": { answer: "", description: "" },
  //   "4c2": { answer: "", description: "" },
  //   "4c3": { answer: "", description: "" },
  //   "4c4": { answer: "", description: "" },
  //   "4c5": { answer: "", description: "" },
  //   "5a1": { answer: "", description: "" },
  //   "5a2": { answer: "", description: "" },
  //   "5a3": { answer: "", description: "" },
  //   "5b1": { answer: "", description: "" },
  //   "6a1": { answer: "", description: "" },
  //   "6a2": { answer: "", description: "" },
  //   "6a3": { answer: "", description: "" },
  //   "6a4": { answer: "", description: "" },
  //   "6a5": { answer: "", description: "" },
  //   "6a6": { answer: "", description: "" },
  //   "6a7": { answer: "", description: "" },
  //   "6b1": { answer: "", description: "" },
  //   "6b2": { answer: "", description: "" },
  //   "6b3": { answer: "", description: "" },
  //   "6b4": { answer: "", description: "" },
  //   "6b5": { answer: "", description: "" },
  //   "6c1": { answer: "", description: "" },
  //   "6c2": { answer: "", description: "" },
  //   "6c3": { answer: "", description: "" },
  //   "6c4": { answer: "", description: "" },
  //   "6c5": { answer: "", description: "" },
  //   "6c6": { answer: "", description: "" },
  //   "6d1": { answer: "", description: "" },
  //   "6d2": { answer: "", description: "" },
  //   "6d3": { answer: "", description: "" },
  //   "6d4": { answer: "", description: "" },
  // };

  return formData;
}
