import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SectionHeading from "../../../app/common/SectionHeading/SectionHeading";
import Loading from "../../../app/layout/Loading/Loading";
import { RootStoreContext } from "../../../app/stores/rootStore";
import AppAdminTargetTPTQuestionEditor from "./LocalComponents/AppAdminTargetTPTQuestionEditor";

const AppAdminTargetPromotionToolQuestionnaireMeta = () => {
  const navigate = useNavigate();
  const rootStore = useContext(RootStoreContext);
  const {
    fetchQuestions,
    questions,
    isFetchingQuestions,
    isEditingQuestions,
    addOrEditQuestions,
  } = rootStore.targetPTQuestionnaireMetaStore;

  const [displayEditDialog, setDisplayEditDialog] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState({});

  useEffect(() => {
    if (!isFetchingQuestions && questions.length === 0) fetchQuestions();
  }, [fetchQuestions]);

  if (isFetchingQuestions) {
    return <Loading />;
  }

  console.log(questions);

  const breadCrumbItems = [
    {
      label: "Target Promotion Tool",
      command: () => {
        navigate("/admin/target-promotion-tool/");
      },
    },
    {
      label: "Promotion Questionnaire Meta",
      command: () => {
        navigate(`/admin/target-promotion-tool/questionnaire-meta/`);
      },
    },
  ];

  // Table templated: Identification
  const identificationTemplate = (rowData) => {
    return (
      <div
        className="flex text-blue-700 underline cursor-pointer"
        onClick={() => {
          setSelectedQuestion(rowData);
          setDisplayEditDialog(true);
        }}
      >
        {rowData.identification}
      </div>
    );
  };

  return (
    <React.Fragment>
      {/* First div for general information and dates */}

      <div className="flex flex-column gap-2 w-full">
        <div className="flex w-full pb-2">
          <BreadCrumb model={breadCrumbItems} />
        </div>
        <div className="flex w-full">
          <SectionHeading
            icon="ri-user-settings-fill"
            heading={"Promotion Questionnaire Meta"}
          />
        </div>
        <div className="flex w-full">
          <DataTable
            value={questions}
            className="p-datatable-sm w-full"
            sortMode="single"
            sortField="displayName"
            sortOrder={1}
            filterDisplay="row"
          >
            <Column
              body={identificationTemplate}
              header="Identification"
              sortable
            />
            <Column field="questionBody" header="QuestionBody" sortable />
            <Column field="section" header="Section" sortable />
            <Column field="subSection" header="Sub Section" sortable />
            <Column field="isAdminOnly" header="isAdminOnly?" />
            <Column field="isDisabled" header="isDisabled?" />
            <Column field="weight" header="Weight" sortable />
          </DataTable>
        </div>
      </div>

      {/* Dialog to edit questions */}
      <Dialog
        header={"Edit Question | " + selectedQuestion.identification}
        visible={displayEditDialog}
        style={{ width: "80vw" }}
        onHide={() => setDisplayEditDialog(false)}
        modal
      >
        <AppAdminTargetTPTQuestionEditor
          question={selectedQuestion}
          closeEditDialog={() => setDisplayEditDialog(false)}
        />
      </Dialog>
    </React.Fragment>
  );
};

export default observer(AppAdminTargetPromotionToolQuestionnaireMeta);
