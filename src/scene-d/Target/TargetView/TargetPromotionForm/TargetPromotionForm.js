import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SectionHeading from "../../../../app/common/SectionHeading/SectionHeading";
import Loading from "../../../../app/layout/Loading/Loading";
import { RootStoreContext } from "../../../../app/stores/rootStore";
import { appColors } from "../../../../colors";
import GenePromoteSummaryAnswers from "../../../Gene/GenePromote/GenePromoteSummary/GenePromoteSummaryAnswers/GenePromoteSummaryAnswers";

const TargetPromotionForm = ({ data, selectedTarget }) => {
  // Get the MobX Store
  const rootStore = useContext(RootStoreContext);
  const geneStore = rootStore.geneStore;

  const {
    questions,
    adminQuestions,
    isFetchingQuestions,
    fetchQuestions,
    questionsRegistry,
    adminQuestionsRegistry,
    isCacheValid,
    questionsGrouped,
    adminQuestionsGrouped,
  } = rootStore.genePromotionStore;

  const navigate = useNavigate();

  const breadCrumbItems = [
    {
      label: "Targets",
      command: () => {
        navigate("/d/target/");
      },
    },
    {
      label: selectedTarget.name,
      command: () => {
        navigate(`/d/target/${selectedTarget.id}`);
      },
    },
    { label: "Promotion Info" },
  ];

  useEffect(() => {
    // Fetch promotion questions if not already loaded
    if (!isCacheValid) {
      fetchQuestions();
    }
  }, [isCacheValid, fetchQuestions]);

  if (isFetchingQuestions) {
    return <Loading />;
  }

  /* create the form read object from data so that questions can read answer */
  let formReadObject = {};
  data.map((items) => {
    formReadObject[items.questionIdentification] = {
      answer: items.answer,
      description: items.description,
    };
  });

  // console.log("formReadObject");
  // console.log(formReadObject);

  let updateTargetPromotionFormValue = (e) => {
    //console.log(e);
  };

  /* Generate the user answered question section */
  let userAnsweredQuestionsGrouped_Render = [];
  for (var section in questionsGrouped) {
    // Extract top level sections
    userAnsweredQuestionsGrouped_Render.push(
      <div className="flex text-xl">{section}</div>
    );
    for (var subSection in questionsGrouped[section]) {
      // Extract sub sections
      userAnsweredQuestionsGrouped_Render.push(
        <div className="flex flex-column ml-2 gap-1">
          <div className="flex text-lg">{subSection}</div>
          <div className="flex text-sm p-2">
            {questionsGrouped[section][subSection][0]["subSectionDescription"]}
          </div>
        </div>
      );

      // extract questions from subsections, use map as it is an array
      questionsGrouped[section][subSection].map((subSectionQuestion) => {
        userAnsweredQuestionsGrouped_Render.push(
          <div className="flex flex-column ml-4 gap-1">
            <GenePromoteSummaryAnswers
              oKey={subSectionQuestion.identification}
              questionObj={questionsRegistry}
              ansObj={formReadObject}
            />
          </div>
        );
      });
    }
  }

  /* Generate the admin question section */
  let adminQuestionsGrouped_Render = [];
  for (var section in adminQuestionsGrouped) {
    // Extract top level sections
    adminQuestionsGrouped_Render.push(
      <div className="flex text-xl">{section}</div>
    );
    for (var subSection in adminQuestionsGrouped[section]) {
      // Extract sub sections
      adminQuestionsGrouped_Render.push(
        <div className="flex flex-column ml-2 gap-1">
          <div className="flex text-lg">{subSection}</div>
          <div className="flex text-sm p-2">
            {
              adminQuestionsGrouped[section][subSection][0][
                "subSectionDescription"
              ]
            }
          </div>
        </div>
      );

      // extract questions from subsections, use map as it is an array
      adminQuestionsGrouped[section][subSection].map((subSectionQuestion) => {
        adminQuestionsGrouped_Render.push(
          <div className="flex flex-column ml-4 gap-1">
            <GenePromoteSummaryAnswers
              oKey={subSectionQuestion.identification}
              questionObj={adminQuestionsRegistry}
              ansObj={formReadObject}
            />
          </div>
        );
      });
    }
  }

  return (
    <div className="flex flex-column w-full">
      <div className="flex w-full pb-2">
        <BreadCrumb model={breadCrumbItems} />
      </div>

      <div className="flex w-full">
        <SectionHeading
          icon="icon icon-common icon-target"
          heading={selectedTarget.name}
          entryPoint={selectedTarget.name}
          displayHorizon={true}
          color={appColors.sectionHeadingBg.target}
        />
      </div>
      <SectionHeading
        icon="icon icon-common icon-info"
        heading={" Target Promotion Info"}
        color={"#f4f4f4"}
        textColor={"#000000"}
        customButtons={[
          {
            label: "Edit",
            icon: "pi pi-tablet",
            action: () => navigate("edit/"),
          },
        ]}
      />
      <div className="flex w-full flex-column pl-2">
        {userAnsweredQuestionsGrouped_Render}
      </div>
      <div className="flex w-full flex-column pl-2 mt-2">
        {adminQuestionsGrouped_Render}
      </div>
    </div>
  );
};

export default observer(TargetPromotionForm);
