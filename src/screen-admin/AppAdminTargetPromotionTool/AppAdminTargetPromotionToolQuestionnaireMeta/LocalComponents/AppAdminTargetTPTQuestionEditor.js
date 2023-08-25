import { ErrorMessage, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { ProgressBar } from "primereact/progressbar";
import { RadioButton } from "primereact/radiobutton";
import React, { useCallback, useContext, useState } from "react";
import * as Yup from "yup";
import { RootStoreContext } from "../../../../app/stores/rootStore";
import AppAdminTargetTPTPossibleAnswerEditor from "./AppAdminTargetTPTPossibleAnswerEditor";

const AppAdminTargetTPTQuestionEditor = ({ question, closeEditDialog }) => {
  const rootStore = useContext(RootStoreContext);
  const { isEditingQuestions, addOrEditQuestions } =
    rootStore.targetPTQuestionnaireMetaStore;

  const initialAnswers = question.possibleAnswerWithDesc || [];

  const [answers, setAnswers] = useState(
    initialAnswers.slice().sort((a, b) => a.answer.localeCompare(b.answer))
  );
  //console.log(answers);

  const handleAnswerChange = useCallback((e) => {
    const { id, name, value } = e.target;
    setAnswers((prevAnswers) =>
      prevAnswers.map((answer) =>
        answer.id.toString() === id ? { ...answer, [name]: value } : answer
      )
    );
  }, []);

  const handleSubmit = (values) => {
    Object.assign(values, {
      id: question.id,
      identification: question.identification,
      PossibleAnswerWithDesc: answers,
    });

    //console.log(values);
    addOrEditQuestions([values]).then(closeEditDialog);
  };

  const validationSchema = Yup.object().shape({
    isAdminOnly: Yup.boolean(),
    isDeleted: Yup.boolean(),
    isDisabled: Yup.boolean(),
    isInverted: Yup.boolean(),
    isRequired: Yup.boolean(),
    module: Yup.string().required("Module is required"),
    questionBody: Yup.string().required("Question body is required"),
    section: Yup.string().required("Section is required"),
    sectionDescription: Yup.string(),
    subSection: Yup.string(),
    subSectionDescription: Yup.string(),
    toolTip: Yup.string(),
    weight: Yup.number().min(0, "Weight must be a positive number"),
  });

  const initialValues = {
    isAdminOnly: question.isAdminOnly || false,
    isDeleted: question.isDeleted || false,
    isDisabled: question.isDisabled || false,
    isInverted: question.isInverted || false,
    isRequired: question.isRequired || false,
    module: question.module || "",
    questionBody: question.questionBody || "",
    section: question.section || "",
    sectionDescription: question.sectionDescription || "",
    subSection: question.subSection || "",
    subSectionDescription: question.subSectionDescription || "",
    toolTip: question.toolTip || "",
    weight: question.weight || 0,
    questionType: question.questionType || "MultipleChoice",
  };

  if (isEditingQuestions) {
    return (
      <div className="flex w-full">
        <ProgressBar
          mode="indeterminate"
          className="w-full"
          style={{ height: "10rem" }}
        />
      </div>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, handleChange }) => (
        <div className="flex justify-content-center gap-2 w-full">
          <Form>
            <div className="flex flex-row gap-2 border-0 border-50 p-2 w-full">
              <div className="flex gap-2 p-2 border-1 border-50">
                <label>Is Required Field ?</label>
                <Checkbox
                  inputId="isRequired"
                  name="isRequired"
                  checked={values.isRequired}
                  onChange={handleChange}
                />
              </div>
              <div className="flex gap-2 p-2 border-1 border-50">
                <label>Is Admin Only ?</label>
                <Checkbox
                  inputId="isAdminOnly"
                  name="isAdminOnly"
                  checked={values.isAdminOnly}
                  onChange={handleChange}
                />
              </div>

              <div className="flex gap-2 p-2 border-1 border-50">
                <label>Is Disabled ?</label>
                <Checkbox
                  inputId="isDisabled"
                  name="isDisabled"
                  checked={values.isDisabled}
                  onChange={handleChange}
                />
              </div>

              <div className="flex gap-2 p-2 border-1 border-50">
                <label>Is Value Inverted ?</label>
                <Checkbox
                  inputId="isInverted"
                  name="isInverted"
                  checked={values.isInverted}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex flex-column gap-1 border-1 border-50	p-2 w-full ">
              <div className="flex flex-row w-full align-items-center">
                <div className="flex w-3">Question</div>
                <div className="flex w-9">
                  <InputText
                    name="questionBody"
                    value={values.questionBody}
                    onChange={handleChange}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
              <div className="flex w-full text-sm	font-bold	text-red-600 text-right">
                <ErrorMessage name="questionBody" component="span" />
              </div>
            </div>

            <div className="flex flex-column gap-1 border-1 border-50	p-2 w-full ">
              <div className="flex flex-row w-full align-items-center">
                <div className="flex w-3">Section</div>
                <div className="flex w-9">
                  <InputText
                    name="section"
                    value={values.section}
                    onChange={handleChange}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
              <div className="flex w-full text-sm	font-bold	text-red-600 text-right">
                <ErrorMessage name="section" component="span" />
              </div>
            </div>

            <div className="flex flex-column gap-1 border-1 border-50	p-2 w-full ">
              <div className="flex flex-row w-full align-items-center">
                <div className="flex w-3">Sub Section</div>
                <div className="flex w-9">
                  <InputText
                    name="subSection"
                    value={values.subSection}
                    onChange={handleChange}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
              <div className="flex w-full text-sm	font-bold	text-red-600 text-right">
                <ErrorMessage name="subSection" component="span" />
              </div>
            </div>

            <div className="flex flex-column gap-1 border-1 border-50	p-2 w-full ">
              <div className="flex flex-row w-full align-items-center">
                <div className="flex w-3">Tool Tip</div>
                <div className="flex w-9">
                  <InputText
                    name="toolTip"
                    value={values.toolTip}
                    onChange={handleChange}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
              <div className="flex w-full text-sm	font-bold	text-red-600 text-right">
                <ErrorMessage name="toolTip" component="span" />
              </div>
            </div>

            <div className="flex flex-column gap-1 border-1 border-50	p-2 w-full ">
              <div className="flex flex-row w-full align-items-center">
                <div className="flex w-3">Weight</div>
                <div className="flex w-9">
                  <InputText
                    name="weight"
                    type="number"
                    value={values.weight}
                    onChange={handleChange}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
              <div className="flex w-full text-sm	font-bold	text-red-600 text-right">
                <ErrorMessage name="weight" component="span" />
              </div>
            </div>

            <div className="flex flex-column gap-1 border-1 border-50	p-2 w-full ">
              <div className="flex flex-row w-full align-items-center">
                <div className="flex w-3">Question Type</div>
                <div className="flex w-9 gap-2">
                  <div className="flex align-items-center">
                    <RadioButton
                      inputId="MultipleChoice"
                      name="questionType"
                      value="MultipleChoice"
                      onChange={handleChange}
                      checked={values.questionType === "MultipleChoice"}
                    />
                    <label htmlFor="MultipleChoice" className="ml-2">
                      Multiple Choice
                    </label>
                  </div>
                  <div className="flex align-items-center">
                    <RadioButton
                      inputId="Text"
                      name="questionType"
                      value="Text"
                      onChange={handleChange}
                      checked={values.questionType === "Text"}
                    />
                    <label htmlFor="Text" className="ml-2">
                      Text
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex w-full text-sm	font-bold	text-red-600 text-right">
                <ErrorMessage name="weight" component="span" />
              </div>
            </div>
            {values.questionType === "MultipleChoice" && (
              <>
                <div className="flex flex-column gap-1 border-1 border-50	p-1 w-full ">
                  <h3>Possible Answers</h3>
                </div>
                <div className="flex flex-column gap-1 border-1 border-50	p-2 w-full ">
                  <AppAdminTargetTPTPossibleAnswerEditor
                    handleChange={handleAnswerChange}
                    answers={answers}
                  />
                </div>
              </>
            )}

            <Button type="submit" label="Submit" />
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default observer(AppAdminTargetTPTQuestionEditor);
