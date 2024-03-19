import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../../../../../Library/Loading/Loading";
import { RootStoreContext } from "../../../../../../RootStore";
import GenePromoteQuestionnaire from "./GenePromoteQuestionnaire/GenePromoteQuestionnaire";
import GenePromoteSummary from "./GenePromoteSummary/GenePromoteSummary";
import { _defaultFormData } from "./helpers/TPQ_helper";

const TPQuestionnaire = ({ selectedGenes, proteinName }) => {
  const rootStore = useContext(RootStoreContext);
  const navigate = useNavigate();
  const { isGeneListCacheValid, isGeneListLoading, geneList, fetchGenes } =
    rootStore.geneStore;

  const {
    questions,
    questionsGrouped,
    isFetchingQuestions,
    fetchQuestions,
    questionsRegistry,
    isCacheValid,
    getGenePromotionDataObj,
    submitPromotionQuestionnaire,
  } = rootStore.targetSourcingStore;

  const [targetPromotionFormValue, setTargetPromotionFormValue] = useState({});
  const [formSuccess, setFormSuccess] = useState(false);
  const [summaryVisible, setSummaryVisible] = useState(false);

  useEffect(() => {
    if (!isGeneListCacheValid) {
      fetchGenes();
    }
  }, [isGeneListCacheValid, fetchGenes]);

  useEffect(() => {
    if (!isCacheValid) {
      fetchQuestions();
    }
  }, [isCacheValid, fetchQuestions]);

  if (isGeneListLoading || isFetchingQuestions) {
    return <Loading message={"Fetching..."} />;
  }

  if (
    !isFetchingQuestions &&
    questionsRegistry.size > 0 &&
    Object.keys(targetPromotionFormValue).length === 0
  ) {
    let targetNameKey = "promote_" + proteinName;
    let storedFormData = localStorage.getItem(targetNameKey);
    console.log("_defaultFormData", _defaultFormData(questionsRegistry));
    setTargetPromotionFormValue(_defaultFormData(questionsRegistry));
    if (storedFormData !== null) {
      setTargetPromotionFormValue(JSON.parse(storedFormData));
    }
  }

  console.log("targetPromotionFormValue", targetPromotionFormValue);

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
    let targetNameKey = "promote_" + proteinName;
    localStorage.setItem(
      targetNameKey,
      JSON.stringify(targetPromotionFormValue)
    );

    // Store drafts
    let existingDrafts = localStorage.getItem("promotion_drafts");
    existingDrafts = existingDrafts ? JSON.parse(existingDrafts) : [];
    if (!existingDrafts.includes(proteinName)) {
      existingDrafts.push(proteinName);
      localStorage.setItem("promotion_drafts", JSON.stringify(existingDrafts));
    }

    toast.success(
      "Saved Locally in browser. Please submit the form when complete."
    );
  };

  const resetFormLocalStorage = () => {
    let targetNameKey = "promote_" + proteinName;
    localStorage.removeItem(targetNameKey);
    setTargetPromotionFormValue(_defaultFormData(questions));

    // Remove draft
    let existingDrafts = localStorage.getItem("promotion_drafts");
    existingDrafts = existingDrafts ? JSON.parse(existingDrafts) : [];
    existingDrafts = existingDrafts.filter((d) => d !== proteinName);
    localStorage.setItem("promotion_drafts", JSON.stringify(existingDrafts));

    toast.success("Cleared");
    navigate("/wf/target/");
  };

  const submitTargetPromotionFormValueForm = () => {
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
      ...getGenePromotionDataObj(),
      response: [],
    };

    console.log("targetPromotionFormValue");
    console.log(targetPromotionFormValue);

    Object.keys(targetPromotionFormValue).map((key) => {
      data.response.push({
        Item1: questionsRegistry.get(key).id,
        Item2: targetPromotionFormValue[key].answer,
        Item3: targetPromotionFormValue[key].description,
      });
    });

    data.requestedTargetName = proteinName;

    // return a dictionary of gene id, gene accession number
    data.requestedAssociatedGenes = {};
    selectedGenes.forEach((g) => {
      data.requestedAssociatedGenes[g.id] = g.accessionNumber;
    });

    console.log("===SUBMIT===");
    console.log(data);

    submitPromotionQuestionnaire(data).then((res) => {
      if (res !== null) {
        setFormSuccess(true);
      }
    });
  };

  let header = (
    <div className="flex flex-row w-full p-2 border-1 border-50 surface-ground border-round-md">
      <div className="flex justify-content-start gap-2">
        <div className="flex flex-grow min-w-max">
          Proposed Target : {proteinName}{" "}
        </div>
        <div className="flex flex-grow min-w-max">
          Selected Genes :{" "}
          {selectedGenes?.map((g) => g.accessionNumber).join(", ")}
        </div>
      </div>
      <div className="flex justify-content-end w-full gap-2">
        <div className="flex flex-grow min-w-max">
          <Button
            type="button"
            icon="pi pi-check-circle"
            label="Save Progress in Browser"
            className="p-button-text p-button-md m-0 p-0"
            onClick={() => saveFormToLocalStorage()}
          />
        </div>
        <div className="flex flex-grow min-w-max">
          <Button
            type="button"
            icon="pi pi-refresh"
            label="Reset & Discard Changes"
            className="p-button-text p-button-md m-0 p-0"
            onClick={() => resetFormLocalStorage()}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500 pb-2 gap-3">
      <div className="flex w-full">{header}</div>
      <div className="flex w-full">
        <GenePromoteQuestionnaire
          proposedTargetName={proteinName}
          targetPromotionFormValue={targetPromotionFormValue}
          updateTargetPromotionFormValue={(e) =>
            updateTargetPromotionFormValue(e)
          }
          showSummary={() => setSummaryVisible(true)}
        />
      </div>
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
    </div>
  );
};

export default observer(TPQuestionnaire);
