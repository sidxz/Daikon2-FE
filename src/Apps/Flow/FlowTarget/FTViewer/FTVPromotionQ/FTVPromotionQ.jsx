import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../../../../Library/Loading/Loading";
import Question from "../../../../../Library/Question/Question";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../../../RootStore";
import { appColors } from "../../../../../constants/colors";
import { TargetIcon } from "../../../icons/TargetIcon";
import * as Helper from "./FTVPromotionQHelper";
const FTVPromotionQ = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    fetchTQByTargetId,
    isFetchingTQ,
    isTQUnVerifiedCacheValid,
    TQUnapproved,
    updateTQ,
    isUpdatingTQ,
    isApprovingTQ,
    selectedTQ,
  } = rootStore.targetPQStore;
  const { isGeneListCacheValid, isGeneListLoading, geneList, fetchGenes } =
    rootStore.geneStore;
  const {
    questions,
    questionsGrouped,
    adminQuestionsGrouped,
    allQuestions,
    isFetchingQuestions,
    fetchQuestions,
    questionsRegistry,
    adminQuestionsRegistry,
    isCacheValid,
    getGenePromotionDataObj,
    submitPromotionQuestionnaire,
  } = rootStore.targetSourcingStore;

  const { selectedTarget, isFetchingTarget } = rootStore.targetStore;
  const [targetPromotionFormValue, setTargetPromotionFormValue] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    if (
      selectedTarget &&
      (selectedTQ === null || selectedTQ.targetId !== selectedTarget.id)
    ) {
      console.log("FTVPromotionQ FETCHING TQ");
      fetchTQByTargetId(selectedTarget.id);
    }
  }, [selectedTarget, fetchTQByTargetId, selectedTQ]);

  useEffect(() => {
    if (!isCacheValid) {
      fetchQuestions();
    }
  }, [isCacheValid, fetchQuestions]);

  console.log("FTVPromotionQ TARGET===", selectedTarget);

  if (isFetchingTQ || isFetchingTarget || isFetchingQuestions) {
    return <Loading message={"Loading Target Promotion Questionnaire"} />;
  } else {
    if (
      !isFetchingQuestions &&
      questionsRegistry.size > 0 &&
      Object.keys(targetPromotionFormValue).length === 0 &&
      selectedTQ?.response?.length > 0
    ) {
      let loadFormValue = allQuestions?.reduce((acc, question) => {
        let ansItem = selectedTQ?.response.find(
          (obj) => obj.item1 === question.identification
        );

        // If ansItem is not found, skip this iteration
        if (!ansItem) return acc;

        acc[ansItem.item1] = {
          answer: ansItem.item2,
          description: ansItem.item3,
        };
        return acc;
      }, {});

      console.log("loadFormValue");
      console.log(loadFormValue);
      setTargetPromotionFormValue(loadFormValue);
    }

    const updateTargetPromotionFormValue = (e) => {
      //console.log(e);
      var location = null;
      var newFormValue = null;
      var newField = null;

      if (e.target.id.endsWith("Description")) {
        location = e.target.id.slice(0, -11);
        newFormValue = { ...targetPromotionFormValue };
        newField = { ...newFormValue[location] };
        newField.description = e.target.value;
        newFormValue[location] = newField;
        setTargetPromotionFormValue(newFormValue);
      } else {
        location = e.target.id;
        newFormValue = { ...targetPromotionFormValue };
        newField = { ...newFormValue[location] };
        newField.answer = e.target.value;
        newFormValue[location] = newField;
        setTargetPromotionFormValue(newFormValue);
      }
    };

    /* Generate the user answered question section */
    let userAnsweredQuestionsGrouped_Render = [];
    for (var section in questionsGrouped) {
      // Extract top level sections
      userAnsweredQuestionsGrouped_Render.push(
        <div className="flex w-full">
          <Divider align="left" className="text-xl font-bold">
            {section}
          </Divider>
        </div>
      );
      for (var subSection in questionsGrouped[section]) {
        // Extract sub sections
        userAnsweredQuestionsGrouped_Render.push(
          <div className="flex flex-column ml-6 gap-1">
            <div className="flex">
              <Divider align="left" type="dotted" className="text-lg font-bold">
                {subSection}
              </Divider>
            </div>
            <div className="flex text-sm p-2">
              {
                questionsGrouped[section][subSection][0][
                  "subSectionDescription"
                ]
              }
            </div>
          </div>
        );

        // extract questions from subsections, use map as it is an array
        questionsGrouped[section][subSection].map((subSectionQuestion) => {
          userAnsweredQuestionsGrouped_Render.push(
            <div className="flex flex-column ml-8 gap-1 pb-2">
              <Question
                question={questionsRegistry.get(
                  subSectionQuestion.identification
                )}
                updateObject={(e) => updateTargetPromotionFormValue(e)}
                readObject={targetPromotionFormValue}
              />
            </div>
          );
        });
      }
    }

    /* Generate the admin question section */
    let adminQuestionsGrouped_Render = [];
    for (var section in adminQuestionsGrouped) {
      // Extract top level sections
      adminQuestionsGrouped_Render.push(
        <div className="flex w-full">
          <Divider align="left" className="text-xl font-bold">
            {section}
          </Divider>
        </div>
      );
      for (var subSection in adminQuestionsGrouped[section]) {
        // Extract sub sections
        adminQuestionsGrouped_Render.push(
          <div className="flex flex-column ml-6 gap-1">
            <div className="flex">
              <Divider align="left" type="dotted" className="text-lg font-bold">
                {subSection}
              </Divider>
            </div>
            <div className="flex text-sm p-2">
              {
                adminQuestionsGrouped[section][subSection][0][
                  "subSectionDescription"
                ]
              }
            </div>
          </div>
        );

        // extract questions from subsections, use map as it is an array
        adminQuestionsGrouped[section][subSection].map((subSectionQuestion) => {
          adminQuestionsGrouped_Render.push(
            <div className="flex flex-column ml-8 gap-1 pb-2">
              <Question
                question={adminQuestionsRegistry.get(
                  subSectionQuestion.identification
                )}
                updateObject={(e) => updateTargetPromotionFormValue(e)}
                readObject={targetPromotionFormValue}
              />
            </div>
          );
        });
      }
    }

    console.log("selectedTQ");
    console.log(selectedTQ);

    let header = (
      <div className="flex flex-row w-full p-2 border-1 border-50 surface-ground border-round-md">
        <div className="flex justify-content-start gap-2">
          <div className="flex flex-grow min-w-max">
            Approved By : {selectedTQ?.requestedTargetName}{" "}
          </div>
          <div className="flex flex-grow min-w-max">Last Edit :</div>
          <div className="flex flex-grow min-w-max">Last Edit on :</div>
        </div>
        <div className="flex justify-content-end w-full gap-2">
          <div className="flex flex-grow min-w-max">
            <Button
              type="button"
              icon="pi pi-arrow-up"
              label="Save Changes to Questionnaire"
              className="p-button-text p-button-md m-0 p-0"
              onClick={() => submitTargetPromotionFormValueForm()}
            />
          </div>
        </div>
      </div>
    );

    const formatTPFormValue = () => {
      var validationFail = false;
      // Object.keys(targetPromotionFormValue).map((key) => {
      //   if (targetPromotionFormValue[key].answer === "") {
      //     console.error("Validation fail, blank answer");
      //     //console.log(targetPromotionFormValue[key]);
      //     validationFail = true;
      //   }
      //   if (
      //     !(
      //       targetPromotionFormValue[key].answer === "UNKNOWN" ||
      //       targetPromotionFormValue[key].answer === "NA"
      //     ) &&
      //     targetPromotionFormValue[key].description === ""
      //   ) {
      //     console.error("Validation fail, blank description");
      //     //console.log(targetPromotionFormValue[key]);
      //     validationFail = true;
      //   }
      // });

      if (validationFail) {
        toast.warning("Required fields are missing");

        return;
      }

      var data = {
        response: [],
      };

      data.id = selectedTQ.id;

      Object.keys(targetPromotionFormValue).map((key) => {
        data.response.push({
          Item1: allQuestions.find((q) => q.identification === key)
            .identification,
          Item2: targetPromotionFormValue[key].answer,
          Item3: targetPromotionFormValue[key].description,
        });
      });

      data.requestedTargetName = selectedTQ.requestedTargetName;

      // return a dictionary of gene id, gene accession number
      data.requestedAssociatedGenes = selectedTQ.requestedAssociatedGenes;
      data.strainId = selectedTQ.strainId;
      return data;
    };

    const submitTargetPromotionFormValueForm = () => {
      const data = formatTPFormValue();
      console.log("===SUBMIT===");
      console.log(data);
      updateTQ(data);
    };

    return (
      <div className="flex flex-column min-w-full fadein animation-duration-500">
        <div className="flex w-full">
          <BreadCrumb
            model={Helper.breadCrumbItems(selectedTarget, navigate)}
          />
        </div>
        <div className="flex w-full">
          <SecHeading
            svgIcon={<TargetIcon size={"25em"} />}
            heading={"Target - " + selectedTarget.name}
            color={appColors.sectionHeadingBg.target}
            displayHorizon={true}
          />
        </div>
        <div className="flex w-full">{header}</div>
        <div className="flex w-full flex-column p-2 m-2">
          {userAnsweredQuestionsGrouped_Render}
        </div>
        <div className="flex w-full flex-column p-2 m-2">
          {adminQuestionsGrouped_Render}
        </div>
      </div>
    );
  }

  return <div>FTVPromotionQ</div>;
};

export default observer(FTVPromotionQ);
