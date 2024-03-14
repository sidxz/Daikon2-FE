import { observer } from "mobx-react-lite";
import React from "react";
import { Route, Routes } from "react-router-dom";
import QnaireDash from "./QnaireDash/QnaireDash";
import QnaireMenuBar from "./QnaireMenuBar/QnaireMenuBar";
import QnaireView from "./QnaireView/QnaireView";
const Questionnaire = () => {
  return (
    <div className="flex flex-column">
      <div className="block mb-2">
        <QnaireMenuBar />
      </div>
      <div className="flex w-full pl-3 pr-3 fadein animation-duration-1000">
        <Routes>
          <Route index element={<QnaireDash />} />
          <Route path="dash/*" element={<QnaireDash />} />
          <Route path="qview/:id/*" element={<QnaireView />} />
        </Routes>
      </div>
    </div>
  );
};

export default observer(Questionnaire);
