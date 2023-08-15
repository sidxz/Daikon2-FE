import yaml from "js-yaml";

export function ExportYamlTargetPromoteToolQuestionnaire(jsObj) {
  // Ensure the provided JSON object has the required properties

  function getReadableTimestamp() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
  }

  // Construct a new JSON object by mapping over the original Data
  const newJsonObj = {
    Name: "TargetPromotionQuestionnaire",
    Type: "Question",
    Data: jsObj.map((item) => ({
      id: item.id,
      identification: item.identification,
      module: item.module,
      section: item.section,
      subSection: item.subSection,
      sectionDescription: item.sectionDescription,
      questionBody: item.questionBody,
      notes: item.notes,
      toolTip: item.toolTip,
      questionType: item.questionType,
      isRequired: item.isRequired,
      isInverted: item.isInverted,
      isAdminOnly: item.isAdminOnly,
      weight: item.weight,
      isHidden: item.isHidden,
      // Map over possibleAnswerWithDesc to construct the new structure
      possibleAnswerWithDesc: item.possibleAnswerWithDesc
        ? item.possibleAnswerWithDesc.map((answer) => ({
            id: answer.id,
            answer: answer.answer,
            questionId: answer.QuestionId,
            description: answer.description,
          }))
        : [],
    })),
  };

  // Convert the new JSON object to a YAML string
  const yamlStr = yaml.dump(newJsonObj);

  // Create a Blob object with the YAML content
  const blob = new Blob([yamlStr], { type: "text/yaml" });
  const url = window.URL.createObjectURL(blob);

  // Trigger a download of the YAML file
  const a = document.createElement("a");
  a.href = url;
  a.download = `TargetPromotionQuestionnaire_${getReadableTimestamp()}.yaml`;
  a.click();

  // Cleanup: revoke the object URL to free up resources
  window.URL.revokeObjectURL(url);
}
