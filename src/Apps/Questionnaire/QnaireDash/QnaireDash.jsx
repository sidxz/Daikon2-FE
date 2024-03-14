import { observer } from "mobx-react-lite";
import { Card } from "primereact/card";
import { Sidebar } from "primereact/sidebar";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../../Library/Loading/Loading";
import { RootStoreContext } from "../../../RootStore";
import QnaireNew from "./QnaireNew";

const QnaireDash = () => {
  const [displayAddSideBar, setDisplayAddSideBar] = useState(false);
  const navigate = useNavigate();

  const rootStore = useContext(RootStoreContext);
  const {
    fetchQuestionnaires,
    questionnaires,
    isFetchingQuestionnaires,
    isQuestionnaireRegistryCacheValid,
  } = rootStore.qnaireStore;

  useEffect(() => {
    if (!isQuestionnaireRegistryCacheValid) {
      fetchQuestionnaires();
    }
  }, [fetchQuestionnaires, isQuestionnaireRegistryCacheValid]);

  if (isFetchingQuestionnaires) {
    return <Loading message={"Fetching Questionnaires..."} />;
  }

  // construct the list of questionnaires
  const qListElements = questionnaires?.map((q) => {
    return (
      <div
        key={q.id}
        className="flex w-15rem hover:shadow-4 cursor-pointer border-round-md"
      >
        <Card title={q.name} onClick={() => navigate("qview/" + q.id)}>
          <p className="m-0">{q.description}</p>
        </Card>
      </div>
    );
  });

  const addSideBarHeader = (
    <div className="flex align-items-center gap-2">
      <i className="icon icon-common icon-plus-circle"></i>
      <span className="font-bold">New Questionnaire</span>
    </div>
  );

  return (
    <>
      <div className="flex w-full bg-gray-50 p-2 gap-2">
        <div className="flex w-15rem hover:shadow-4 cursor-pointer border-round-md">
          <Card
            title="New Questionnaire"
            onClick={() => setDisplayAddSideBar(true)}
          >
            <p className="m-0">Create a new questionnaire.</p>
          </Card>
        </div>
        {qListElements}
      </div>
      <Sidebar
        visible={displayAddSideBar}
        position="right"
        onHide={() => setDisplayAddSideBar(false)}
        className="p-sidebar-sm"
        header={addSideBarHeader}
      >
        <QnaireNew closeSideBar={() => setDisplayAddSideBar(false)} />
      </Sidebar>
    </>
  );
};

export default observer(QnaireDash);
