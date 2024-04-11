import { observer } from "mobx-react-lite";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../../Library/Loading/Loading";
import SecHeading from "../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../RootStore";
import { appColors } from "../../../constants/colors";
import { QuestionnaireIcon } from "../icons/QuestionnaireIcon";
import QnaireDataTableHeader from "./components/QnaireDataTableHeader";

const QnaireView = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    fetchQuestionnaires,
    isFetchingQuestionnaires,
    fetchQuestionnaire,
    isFetchingQuestionnaire,
    isQuestionnaireRegistryCacheValid,
    selectedQuestionnaire,
    isUpdatingQuestionnaire,
  } = rootStore.qnaireStore;
  const params = useParams();

  const [displayEditDialog, setDisplayEditDialog] = useState(false);
  const [displayImportDialog, setDisplayImportDialog] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState({});

  useEffect(() => {
    if (
      selectedQuestionnaire === undefined ||
      !isQuestionnaireRegistryCacheValid ||
      selectedQuestionnaire?.id !== params?.id
    ) {
      fetchQuestionnaires();
      fetchQuestionnaire(params.id);
    }
  }, [
    fetchQuestionnaire,
    isQuestionnaireRegistryCacheValid,
    params.id,
    selectedQuestionnaire,
  ]);

  if (isFetchingQuestionnaire || isFetchingQuestionnaires) {
    return <Loading message={"Fetching Questionnaire..."} />;
  }

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
    <div className="flex flex-column w-full">
      <div className="flex w-full">
        <SecHeading
          svgIcon={<QuestionnaireIcon size="30em" />}
          heading={selectedQuestionnaire?.name}
          displayHorizon={false}
          color={appColors.sectionHeadingBg.screen}
        />
      </div>
      <div className="flex w-full">
        <DataTable
          value={selectedQuestionnaire?.questions}
          className="p-datatable-sm w-full"
          sortMode="single"
          sortField="displayName"
          sortOrder={1}
          filterDisplay="row"
          header={
            <QnaireDataTableHeader
              selectedQuestionnaire={selectedQuestionnaire}
            />
          }
          loading={
            isFetchingQuestionnaire ||
            isFetchingQuestionnaires ||
            isUpdatingQuestionnaire
          }
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
  );
};

export default observer(QnaireView);
