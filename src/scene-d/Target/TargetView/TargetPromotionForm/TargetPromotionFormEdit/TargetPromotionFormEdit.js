import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Question from "../../../../../app/common/Question/Question";
import SectionHeading from "../../../../../app/common/SectionHeading/SectionHeading";
import Loading from "../../../../../app/layout/Loading/Loading";
import { RootStoreContext } from "../../../../../app/stores/rootStore";
import { appColors } from "../../../../../colors";
const TargetPromotionFormEdit = ({ data, selectedTarget }) => {
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

  const { editTargetPromotionInfo, isEditingTargetPromotionInfo } =
    rootStore.targetStore;

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
    {
      label: "Promotion Info",
      command: () => {
        navigate(`/d/target/${selectedTarget.id}/promotion-info`);
      },
    },
    {
      label: "Edit",
    },
  ];

  useEffect(() => {
    // Fetch promotion questions if not already loaded
    if (!isCacheValid) {
      fetchQuestions();
    }
  }, [isCacheValid, fetchQuestions]);

  /* create the form read object from data so that questions can read answer */
  let initialFormValues = {};
  data.map((items) => {
    initialFormValues[items.questionIdentification] = {
      answer: items.answer,
      description: items.description,
    };
  });

  console.log("initialFormValues");
  console.log(initialFormValues);

  const [targetPromotionToolFormValue, setTargetPromotionToolFormValue] =
    useState({ ...initialFormValues });

  const [validationFails, setValidationFails] = useState([]);

  if (isFetchingQuestions) {
    return <Loading />;
  }

  const updateTargetPromotionFormValue = (e) => {
    console.log(e);
    var location = null;
    var newFormValue = null;
    var newField = null;

    if (e.target.id.endsWith("Description")) {
      location = e.target.id.slice(0, -11);
      newFormValue = { ...targetPromotionToolFormValue };
      newField = { ...newFormValue[location] };
      newField.description = e.target.value;
      newFormValue[location] = newField;
      setTargetPromotionToolFormValue(newFormValue);
    } else {
      location = e.target.id;
      newFormValue = { ...targetPromotionToolFormValue };
      newField = { ...newFormValue[location] };
      newField.answer = e.target.value;
      newFormValue[location] = newField;
      setTargetPromotionToolFormValue(newFormValue);
    }
  };

  let submitTargetPromotionFormValueForm = () => {
    // Submit the form with the edited values
    var validationFail = false;
    var t_validationFails = [];
    Object.keys(targetPromotionToolFormValue).map((key) => {
      if (
        targetPromotionToolFormValue[key].answer === "" ||
        targetPromotionToolFormValue[key].answer === null
      ) {
        console.error("Validation fail, blank answer");
        //console.log(key);
        validationFail = true;
        t_validationFails.push(key);
      }
      if (
        !(
          targetPromotionToolFormValue[key].answer === "UNKNOWN" ||
          targetPromotionToolFormValue[key].answer === "NA"
        ) &&
        (!targetPromotionToolFormValue[key].description ||
          targetPromotionToolFormValue[key].description === "")
      ) {
        console.error("Validation fail, blank description");
        //console.log(key);
        validationFail = true;
        t_validationFails.push(key);
      }
    });
    setValidationFails(t_validationFails);

    if (validationFail) {
      toast.error("Required fields are missing.");
      return;
    }

    var data = [];

    Object.keys(targetPromotionToolFormValue).forEach((key) => {
      if (
        !(key in initialFormValues) ||
        initialFormValues[key].answer !==
          targetPromotionToolFormValue[key].answer ||
        initialFormValues[key].description !==
          targetPromotionToolFormValue[key].description
      ) {
        const questionId = questionsRegistry.get(key)
          ? questionsRegistry.get(key).id
          : adminQuestionsRegistry.get(key).id;

        data.push({
          questionId: questionId,
          answer: targetPromotionToolFormValue[key].answer,
          description: targetPromotionToolFormValue[key].description,
        });
      }
    });

    if (data.length > 0) {
      editTargetPromotionInfo(data).then(() => navigate(-1));
    } else {
      toast.info("No changes to save.");
    }
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
            <Question
              question={questionsRegistry.get(
                subSectionQuestion.identification
              )}
              updateObject={(e) => updateTargetPromotionFormValue(e)}
              readObject={targetPromotionToolFormValue}
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
            <Question
              question={adminQuestionsRegistry.get(
                subSectionQuestion.identification
              )}
              updateObject={(e) => updateTargetPromotionFormValue(e)}
              readObject={targetPromotionToolFormValue}
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
        icon="icon icon-common icon-angle-right"
        heading={" Editing Target Promotion Info"}
        color={"#fde4cf"}
        textColor={"#000000"}
        customButtons={[
          {
            label: "Cancel",
            icon: "pi pi-times",
            action: () => navigate(-1),
            disabled: isEditingTargetPromotionInfo,
          },
          {
            label: "Save to database",
            icon: "icon icon-common icon-database-submit",
            action: () => submitTargetPromotionFormValueForm(),
            loading: isEditingTargetPromotionInfo,
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

  return <Loading />;
};

export default observer(TargetPromotionFormEdit);
