import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import Loading from "../../../../../Library/Loading/Loading";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../../../RootStore";
import { appColors } from "../../../../../constants/colors";
import { QuestionnaireIcon } from "../../../../Questionnaire/icons/QuestionnaireIcon";
import TPQuestionnaire from "./components/TPQuestionnaire";
import TPSelector from "./components/TPSelector";
const TargetPromotionQuestionnaire = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    isGeneListCacheValid,
    isGeneListLoading,
    geneList,
    fetchGenes,
    availableGeneFunctionalCategories,
  } = rootStore.geneStore;

  const [selectedGenes, setSelectedGenes] = useState([]);
  const [proteinName, setProteinName] = useState("");
  const [isGenePanelOpen, setIsGenePanelOpen] = useState(true);
  const [isQuestionnairePanelOpen, setIsQuestionnairePanelOpen] =
    useState(false);

  useEffect(() => {
    if (!isGeneListCacheValid) {
      fetchGenes();
    }
  }, [isGeneListCacheValid, fetchGenes]);

  if (isGeneListLoading) {
    return <Loading message={"Fetching Genes..."} />;
  }

  return (
    <>
      <div className="flex flex-column min-w-full fadein animation-duration-500 pb-2">
        <div className="flex w-full">
          <SecHeading
            svgIcon={<QuestionnaireIcon size={"25em"} />}
            heading="Target Promotion Questionnaire"
            color={appColors.sectionHeadingBg.target}
          />
        </div>
        {isGenePanelOpen && (
          <div className="flex w-full">
            <TPSelector
              selectedGenes={selectedGenes}
              setSelectedGenes={setSelectedGenes}
              setProteinName={setProteinName}
              geneList={geneList}
              proteinName={proteinName}
              nextStep={() => {
                console.log("next step");
                setIsGenePanelOpen(false);
                setIsQuestionnairePanelOpen(true);
              }}
            />
          </div>
        )}
        {isQuestionnairePanelOpen && (
          <div className="flex w-full">
            <TPQuestionnaire
              selectedGenes={selectedGenes}
              setSelectedGenes={setSelectedGenes}
              setProteinName={setProteinName}
              geneList={geneList}
              proteinName={proteinName}
              nextStep={() => {
                console.log("next step");
                setIsGenePanelOpen(false);
                setIsQuestionnairePanelOpen(true);
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default observer(TargetPromotionQuestionnaire);
