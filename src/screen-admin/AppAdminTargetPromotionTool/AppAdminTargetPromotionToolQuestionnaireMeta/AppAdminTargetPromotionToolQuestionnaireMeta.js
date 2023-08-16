import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FailedLoading from "../../../app/common/FailedLoading/FailedLoading";
import SectionHeading from "../../../app/common/SectionHeading/SectionHeading";
import Loading from "../../../app/layout/Loading/Loading";
import { RootStoreContext } from "../../../app/stores/rootStore";
import { ExportYamlTargetPromoteToolQuestionnaire } from "./Helper_AppAdminTargetPromotionToolQuestionnaireMeta";
import AppAdminTargetTPTImporter from "./LocalComponents/AppAdminTargetTPTImporter";
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
  const [displayImportDialog, setDisplayImportDialog] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState({});

  useEffect(() => {
    if (!isFetchingQuestions && questions.length === 0) fetchQuestions();
  }, [fetchQuestions]);

  if (isFetchingQuestions) {
    return <Loading />;
  } else if (!isFetchingQuestions) {
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
              customButtons={[
                {
                  label: "Import",
                  icon: "icon icon-common icon-upload",
                  action: () => setDisplayImportDialog(true),
                  disabled: false,
                },
                {
                  label: "Export",
                  icon: "icon icon-common icon-download",
                  action: () =>
                    ExportYamlTargetPromoteToolQuestionnaire(questions),
                  loading: false,
                },
              ]}
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
          blockScroll={true}
        >
          <AppAdminTargetTPTQuestionEditor
            question={selectedQuestion}
            closeEditDialog={() => setDisplayEditDialog(false)}
          />
        </Dialog>

        {/* Dialog to Import questions */}
        <Dialog
          header={"Import from YAML file"}
          visible={displayImportDialog}
          style={{ width: "80vw" }}
          onHide={() => setDisplayImportDialog(false)}
          modal
          blockScroll={true}
        >
          <AppAdminTargetTPTImporter
            closeImportDialog={() => setDisplayImportDialog(false)}
          />
        </Dialog>
      </React.Fragment>
    );
  }

  return <FailedLoading />;
};

export default observer(AppAdminTargetPromotionToolQuestionnaireMeta);
