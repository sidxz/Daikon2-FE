import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import QnaireAPI from "../api/QnaireAPI";

export default class QnaireStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;

    makeObservable(this, {
      questionnaireRegistry: observable,
      fetchQuestionnaires: action,
      isFetchingQuestionnaires: observable,
      isQuestionnaireRegistryCacheValid: observable,
      questionnaires: computed,

      fetchQuestionnaire: action,
      isFetchingQuestionnaire: observable,

      createQuestionnaire: action,
      isCreatingQuestionnaire: observable,

      updateQuestionnaire: action,
      isUpdatingQuestionnaire: observable,

      deleteQuestionnaire: action,
      isDeletingQuestionnaire: observable,

      selectedQuestionnaire: observable,
    });
  }

  // Observables
  isFetchingQuestionnaires = false;
  isQuestionnaireRegistryCacheValid = false;
  questionnaireRegistry = new Map();
  isFetchingQuestionnaire = false;
  isCreatingQuestionnaire = false;
  isUpdatingQuestionnaire = false;
  isDeletingQuestionnaire = false;
  selectedQuestionnaire = null;

  // Actions
  fetchQuestionnaires = async (inValidateCache = false) => {
    if (inValidateCache) {
      this.isQuestionnaireRegistryCacheValid = false;
    }
    if (this.isQuestionnaireRegistryCacheValid) {
      return;
    }
    this.isFetchingQuestionnaires = true;
    try {
      const questionnaires = await QnaireAPI.list();
      runInAction(() => {
        questionnaires.forEach((questionnaire) => {
          this.questionnaireRegistry.set(questionnaire.id, questionnaire);
        });
        this.isQuestionnaireRegistryCacheValid = true;
      });
    } catch (error) {
      console.error("Error fetching questionnaires", error);
    } finally {
      this.isFetchingQuestionnaires = false;
    }
  };

  get questionnaires() {
    return Array.from(this.questionnaireRegistry.values());
  }

  fetchQuestionnaire = async (id, inValidateCache = false) => {
    this.isFetchingQuestionnaire = true;

    if (inValidateCache) {
      this.isQuestionnaireRegistryCacheValid = false;
    }

    // First check in registry
    if (this.isQuestionnaireRegistryCacheValid) {
      const questionnaire = this.questionnaireRegistry.get(id);
      if (questionnaire) {
        runInAction(() => {
          this.selectedQuestionnaire = questionnaire;
        });
        return;
      }
    }
    try {
      const questionnaire = await QnaireAPI.read(id);
      runInAction(() => {
        this.questionnaireRegistry.set(questionnaire.id, questionnaire);
        this.selectedQuestionnaire = questionnaire;
      });
    } catch (error) {
      console.error("Error fetching questionnaire", error);
    } finally {
      this.isFetchingQuestionnaire = false;
    }
  };

  createQuestionnaire = async (questionnaire) => {
    console.log("createQuestionnaire", questionnaire);
    this.isCreatingQuestionnaire = true;
    try {
      const newQuestionnaire = await QnaireAPI.create(questionnaire);
      runInAction(() => {
        this.questionnaireRegistry.set(newQuestionnaire.id, newQuestionnaire);
      });
    } catch (error) {
      console.error("Error creating questionnaire", error);
    } finally {
      this.isCreatingQuestionnaire = false;
    }
  };

  updateQuestionnaire = async (questionnaire) => {
    this.isUpdatingQuestionnaire = true;
    try {
      const updatedQuestionnaire = await QnaireAPI.update(questionnaire);
      runInAction(() => {
        this.questionnaireRegistry.set(
          updatedQuestionnaire.id,
          updatedQuestionnaire
        );
      });
    } catch (error) {
      console.error("Error updating questionnaire", error);
    } finally {
      this.isUpdatingQuestionnaire = false;
    }
  };

  deleteQuestionnaire = async (id) => {
    this.isDeletingQuestionnaire = true;
    try {
      await QnaireAPI.delete(id);
      runInAction(() => {
        this.questionnaireRegistry.delete(id);
      });
    } catch (error) {
      console.error("Error deleting questionnaire", error);
    } finally {
      this.isDeletingQuestionnaire = false;
    }
  };
}
