import { observer } from "mobx-react-lite";
import { Dialog } from "primereact/dialog";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Success from "../../../app/common/Success/Success";
import Loading from "../../../app/layout/Loading/Loading";
import { RootStoreContext } from "../../../app/stores/rootStore";
import GenePromoteQuestionnaire from "./GenePromoteQuestionnaire/GenePromoteQuestionnaire";
import GenePromoteSummary from "./GenePromoteSummary/GenePromoteSummary";
import { _defaultFormData } from "./GenePromote_helper";

const GenePromote = () => {
  const rootStore = useContext(RootStoreContext);

  const params = useParams();

  const {
    questions,
    isFetchingQuestions,
    fetchQuestions,
    questionsRegistry,
    isCacheValid,
    getGenePromotionDataObj,
    isPromotionQuestionnaireSubmitting,
    submitPromotionQuestionnaire,
  } = rootStore.genePromotionStore;

  const [targetPromotionFormValue, setTargetPromotionFormValue] = useState({});
  const [formSuccess, setFormSuccess] = useState(false);
  const [summaryVisible, setSummaryVisible] = useState(false);

  useEffect(() => {
    if (!isCacheValid) {
      fetchQuestions();
    }
  }, [isCacheValid, fetchQuestions]);

  /** Loading Overlay */
  if (isFetchingQuestions) {
    return <Loading />;
  }

  if (
    !isFetchingQuestions &&
    questionsRegistry.size > 0 &&
    Object.keys(targetPromotionFormValue).length === 0
  ) {
    let targetNameKey = "promote_" + params.proposedTargetName;
    let storedFormData = localStorage.getItem(targetNameKey);
    //console.log("_defaultFormData", _defaultFormData(questionsRegistry));
    setTargetPromotionFormValue(_defaultFormData(questionsRegistry));
    //console.log("storedFormData", storedFormData);
    //console.log("targetPromotionFormValue", targetPromotionFormValue);
    if (storedFormData !== null) {
      setTargetPromotionFormValue(JSON.parse(storedFormData));
    }
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

  const saveFormToLocalStorage = () => {
    let targetNameKey = "promote_" + params.proposedTargetName;
    localStorage.setItem(
      targetNameKey,
      JSON.stringify(targetPromotionFormValue)
    );

    toast.success(
      "Saved Locally in browser. Please submit the form when complete."
    );
  };

  const resetFormLocalStorage = () => {
    let targetNameKey = "promote_" + params.proposedTargetName;
    localStorage.removeItem(targetNameKey);
    setTargetPromotionFormValue(_defaultFormData(questionsRegistry));
    toast.success("Cleared");
  };

  const submitTargetPromotionFormValueForm = () => {
    var validationFail = false;
    Object.keys(targetPromotionFormValue).map((key) => {
      if (targetPromotionFormValue[key].answer === "") {
        console.error("Validation fail, blank answer");
        //console.log(targetPromotionFormValue[key]);
        validationFail = true;
      }
      if (
        !(
          targetPromotionFormValue[key].answer === "UNKNOWN" ||
          targetPromotionFormValue[key].answer === "NA"
        ) &&
        targetPromotionFormValue[key].description === ""
      ) {
        console.error("Validation fail, blank description");
        //console.log(targetPromotionFormValue[key]);
        validationFail = true;
      }
    });

    if (validationFail) {
      toast.warning("Required fields are missing");

      return;
    }

    var data = {
      ...getGenePromotionDataObj(),
      genePromotionRequestValues: [],
    };

    Object.keys(targetPromotionFormValue).map((key) => {
      data.genePromotionRequestValues.push({
        questionId: questionsRegistry.get(key).id,
        answer: targetPromotionFormValue[key].answer,
        description: targetPromotionFormValue[key].description,
      });
    });

    //console.log("===SUBMIT===");
    //console.log(data);
    return;
    submitPromotionQuestionnaire(params.proposedTargetName, data).then(
      (res) => {
        if (res !== null) {
          setFormSuccess(true);
        }
      }
    );
  };

  if (formSuccess) {
    let targetNameKey = "promote_" + params.proposedTargetName;
    localStorage.removeItem(targetNameKey);
    return (
      <Success
        message={"Thank you, Target WG will review & assigns a bucket."}
      />
    );
  }

  if (isPromotionQuestionnaireSubmitting) {
    return <Loading />;
  }

  return (
    <>
      <GenePromoteQuestionnaire
        proposedTargetName={params.proposedTargetName}
        targetPromotionFormValue={targetPromotionFormValue}
        updateTargetPromotionFormValue={(e) =>
          updateTargetPromotionFormValue(e)
        }
        saveFormToLocalStorage={() => saveFormToLocalStorage()}
        resetFormLocalStorage={() => resetFormLocalStorage()}
        showSummary={() => setSummaryVisible(true)}
      />
      <Dialog
        header="Summary"
        visible={summaryVisible}
        style={{ width: "90vw" }}
        onHide={() => setSummaryVisible(false)}
      >
        <GenePromoteSummary
          questions={questions}
          targetPromotionFormValue={targetPromotionFormValue}
          promotionQuestionsRegistry={questionsRegistry}
          submitTargetPromotionFormValueForm={() =>
            submitTargetPromotionFormValueForm()
          }
        />
      </Dialog>
    </>
  );
};

export default observer(GenePromote);
