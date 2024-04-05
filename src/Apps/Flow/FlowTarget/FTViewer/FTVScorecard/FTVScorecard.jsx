import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../../../../Library/Loading/Loading";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../../../RootStore";
import { appColors } from "../../../../../constants/colors";
import { TargetIcon } from "../../../icons/TargetIcon";
import FTVScorecardGrid from "./FTVScorecardGrid/FTVScorecardGrid";
import * as Helper from "./FTVScorecardHelper";

const FTVScorecard = () => {
  const navigate = useNavigate();
  const rootStore = useContext(RootStoreContext);
  const params = useParams();

  const {
    fetchTQByTargetId,
    isFetchingTQ,
    isTQUnVerifiedCacheValid,
    selectedTQ,
  } = rootStore.targetPQStore;

  const {
    allQuestions,
    isFetchingQuestions,
    fetchQuestions,
    questionsRegistry,
    adminQuestionsRegistry,
    isCacheValid,
  } = rootStore.targetSourcingStore;

  const { selectedTarget, isFetchingTarget } = rootStore.targetStore;

  useEffect(() => {
    if (
      selectedTarget &&
      (selectedTQ === null || selectedTQ.targetId !== selectedTarget.id)
    ) {
      fetchTQByTargetId(selectedTarget.id);
    }
  }, [selectedTarget, fetchTQByTargetId, selectedTQ]);

  useEffect(() => {
    if (!isCacheValid) {
      fetchQuestions();
    }
  }, [isCacheValid, fetchQuestions]);

  if (isFetchingTarget || isFetchingQuestions || isFetchingTQ) {
    return <Loading message={"Fetching Target..."} />;
  }

  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500">
      <div className="flex w-full">
        <BreadCrumb model={Helper.breadCrumbItems(selectedTarget, navigate)} />
      </div>
      <div className="flex w-full">
        <SecHeading
          svgIcon={<TargetIcon size={"25em"} />}
          heading={"Target - " + selectedTarget?.name}
          color={appColors.sectionHeadingBg.target}
          displayHorizon={true}
          entryPoint={selectedTarget?.id}
        />
      </div>
      <div className="flex w-full p-2">
        <FTVScorecardGrid
          questions={new Map([...questionsRegistry, ...adminQuestionsRegistry])}
          selectedTQ={selectedTQ}
        />
      </div>
    </div>
  );
};

export default observer(FTVScorecard);
