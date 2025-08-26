import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Divider } from "primereact/divider";
import { Panel } from "primereact/panel";
import { Sidebar } from "primereact/sidebar";
import { toast } from "react-toastify";

import Loading from "../../../../../Library/Loading/Loading";
import Question from "../../../../../Library/Question/Question";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../../../RootStore";
import { appColors } from "../../../../../constants/colors";
import { TargetIcon } from "../../../icons/TargetIcon";
import FTAVApproveDialog from "./components/FTAVApproveDialog";

const FTApprovalView = () => {
  const rootStore = useContext(RootStoreContext);
  const navigate = useNavigate();
  const {
    fetchTQ,
    isFetchingTQ,
    isTQXVerifiedCacheValid,
    TQUnapproved, // kept even if not used to avoid logic change in store selection
    updateTQ,
    isUpdatingTQ, // kept even if not used to avoid logic change in store selection
    isApprovingTQ,
    selectedTQ,
    rejectAndDeleteTQ,
    isDeletingTQ,
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

  const params = useParams();

  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [targetPromotionFormValue, setTargetPromotionFormValue] = useState({});

  // --- Effects -------------------------------------------------------

  useEffect(() => {
    if (!isGeneListCacheValid) fetchGenes();
  }, [isGeneListCacheValid, fetchGenes]);

  useEffect(() => {
    if (!isCacheValid) fetchQuestions();
  }, [isCacheValid, fetchQuestions]);

  useEffect(() => {
    if (selectedTQ === null || selectedTQ?.id !== params.id) {
      fetchTQ(params.id);
    }
  }, [fetchTQ, isTQXVerifiedCacheValid, params.id, selectedTQ]);

  // Prefill form values once questions and TQ are ready
  useEffect(() => {
    if (
      !isFetchingQuestions &&
      questionsRegistry.size > 0 &&
      Object.keys(targetPromotionFormValue).length === 0 &&
      selectedTQ?.response?.length > 0 &&
      selectedTQ?.id === params.id
    ) {
      const loadFormValue = allQuestions?.reduce((acc, q) => {
        const ansItem = selectedTQ?.response.find(
          (obj) => obj.item1 === q.identification
        );
        if (!ansItem) return acc;
        acc[ansItem.item1] = {
          answer: ansItem.item2,
          description: ansItem.item3,
        };
        return acc;
      }, {});
      if (loadFormValue) setTargetPromotionFormValue(loadFormValue);
    }
  }, [
    allQuestions,
    isFetchingQuestions,
    params.id,
    questionsRegistry,
    selectedTQ,
    targetPromotionFormValue,
  ]);

  // --- Handlers ------------------------------------------------------

  const handleRejectAndDelete = () => {
    if (!selectedTQ?.id) return;
    confirmDialog({
      header: "Confirm Deletion",
      message: (
        <div className="text-sm">
          Are you sure you want to <b>Reject & Delete</b>{" "}
          <i>{selectedTQ?.requestedTargetName}</i>? This action cannot be
          undone.
        </div>
      ),
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      rejectClassName: "p-button-text",
      acceptLabel: "Yes, delete",
      rejectLabel: "Cancel",
      defaultFocus: "reject",
      closable: true,
      accept: async () => {
        const id = selectedTQ.id;
        navigate("/wf/target/sourcing/approval", { replace: true });
        try {
          await rejectAndDeleteTQ(id);
        } catch (e) {
          // optional: toast error and maybe revalidate list
        }
      },
    });
  };

  const updateTargetPromotionFormValue = (e) => {
    const isDesc = e.target.id.endsWith("Description");
    const key = isDesc ? e.target.id.slice(0, -11) : e.target.id;
    const newFormValue = { ...targetPromotionFormValue };
    const newField = { ...(newFormValue[key] || {}) };

    if (isDesc) newField.description = e.target.value;
    else newField.answer = e.target.value;

    newFormValue[key] = newField;
    setTargetPromotionFormValue(newFormValue);
  };

  const formatTPFormValue = () => {
    // placeholder for possible validation in future
    const validationFail = false;
    if (validationFail) {
      toast.warning("Required fields are missing");
      return;
    }

    const data = { response: [] };
    data.id = selectedTQ.id;

    Object.keys(targetPromotionFormValue).forEach((key) => {
      data.response.push({
        Item1: allQuestions.find((q) => q.identification === key)
          .identification,
        Item2: targetPromotionFormValue[key].answer,
        Item3: targetPromotionFormValue[key].description,
      });
    });

    data.requestedTargetName = selectedTQ.requestedTargetName;
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

  // --- Render helpers ------------------------------------------------

  const renderGroupedQuestions = (groups, registry, prefix) => {
    const out = [];

    Object.keys(groups).forEach((section) => {
      out.push(
        <div className="flex w-full" key={`${prefix}-sec-${section}`}>
          <Divider align="left" className="text-xl font-bold">
            {section}
          </Divider>
        </div>
      );

      Object.keys(groups[section]).forEach((subSection) => {
        out.push(
          <div
            className="flex flex-column ml-6 gap-1"
            key={`${prefix}-sub-${section}-${subSection}`}
          >
            <div className="flex">
              <Divider align="left" type="dotted" className="text-lg font-bold">
                {subSection}
              </Divider>
            </div>
            <div className="flex text-sm p-2">
              {groups[section][subSection][0]["subSectionDescription"]}
            </div>
          </div>
        );

        groups[section][subSection].forEach((subSectionQuestion) => {
          out.push(
            <div
              className="flex flex-column ml-8 gap-1 pb-2"
              key={`${prefix}-q-${subSectionQuestion.identification}`}
            >
              <Question
                question={registry.get(subSectionQuestion.identification)}
                updateObject={updateTargetPromotionFormValue}
                readObject={targetPromotionFormValue}
              />
            </div>
          );
        });
      });
    });

    return out;
  };

  const headerBar = (
    <div className="flex flex-row w-full p-2 border-1 border-50 surface-ground border-round-md">
      <div className="flex justify-content-start gap-2">
        <div className="flex flex-grow min-w-max">
          Proposed Target : {selectedTQ?.requestedTargetName}
        </div>
        <div className="flex flex-grow min-w-max">
          Selected Genes :
          {selectedTQ?.requestedAssociatedGenes &&
          Array.isArray(selectedTQ.requestedAssociatedGenes)
            ? selectedTQ.requestedAssociatedGenes
                .map((g) => g.accessionNumber)
                .join(", ")
            : ""}
        </div>
      </div>
      <div className="flex justify-content-end w-full gap-2">
        <div className="flex flex-grow min-w-max">
          <Button
            type="button"
            icon="pi pi-arrow-up"
            label="Save Changes to Questionnaire"
            className="p-button-text p-button-md m-0 p-0"
            onClick={submitTargetPromotionFormValueForm}
          />
        </div>
        <div className="flex flex-grow min-w-max">
          <Button
            type="button"
            icon="pi pi-times"
            label="Reject & Delete"
            className="p-button-text p-button-md m-0 p-0"
            onClick={handleRejectAndDelete}
            loading={isDeletingTQ}
            disabled={isDeletingTQ}
          />
        </div>
        <div className="flex flex-grow min-w-max">
          <Button
            type="button"
            icon="pi pi-check-circle"
            label="Approve Target"
            className="p-button-text p-button-md m-0 p-0"
            onClick={() => setShowApproveDialog(true)}
          />
        </div>
      </div>
    </div>
  );

  // --- Loading gate --------------------------------------------------

  if (
    isFetchingTQ ||
    isGeneListLoading ||
    isFetchingQuestions ||
    isApprovingTQ
  ) {
    return (
      <>
        <ConfirmDialog />
        <Loading message={"Fetching Questionnaire..."} />
      </>
    );
  }

  // --- Main render ---------------------------------------------------

  const userQuestionsRender = renderGroupedQuestions(
    questionsGrouped,
    questionsRegistry,
    "user"
  );

  const adminQuestionsRender = renderGroupedQuestions(
    adminQuestionsGrouped,
    adminQuestionsRegistry,
    "admin"
  );

  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500">
      <div className="flex w-full">
        <SecHeading
          svgIcon={<TargetIcon size={"25em"} />}
          heading={
            "Target Awaiting Approval ( " +
            selectedTQ?.requestedTargetName +
            " )"
          }
          color={appColors.sectionHeadingBg.target}
          displayHorizon={false}
        />
      </div>

      <div className="flex w-full">{headerBar}</div>

      <div className="flex w-full flex-column p-2 m-2">
        <Panel
          header="Target Promotion Questionnaire (User's Submission)"
          className="w-full"
          toggleable
        >
          {userQuestionsRender}
        </Panel>
      </div>

      <div className="flex w-full flex-column p-2 m-2">
        <Panel
          header="Target Promotion Questionnaire (Admin)"
          className="w-full"
          toggleable
        >
          {adminQuestionsRender}
        </Panel>
      </div>

      <div className="flex w-full">
        <Sidebar
          visible={showApproveDialog}
          position="right"
          className="p-sidebar-md"
          onHide={() => setShowApproveDialog(false)}
        >
          <FTAVApproveDialog formatTPFormValue={formatTPFormValue} />
        </Sidebar>
      </div>
    </div>
  );
};

export default observer(FTApprovalView);
