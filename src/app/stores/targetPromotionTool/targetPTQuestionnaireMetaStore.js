import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { toast } from "react-toastify";
import agent from "../../api/agent";
export default class TargetPTQuestionnaireMetaStore {
  rootStore;

  questionsRegistry = new Map();
  isFetchingQuestions = false;
  isEditingQuestions = false;

  constructor(rootStore) {
    this.rootStore = rootStore;

    makeObservable(this, {
      questions: observable,
      isFetchingQuestions: observable,
      fetchQuestions: action,
      questionsRegistry: observable,
      questions: computed,

      addOrEditQuestions: action,
      isEditingQuestions: observable,
    });
  }

  fetchQuestions = async () => {
    this.isFetchingQuestions = true;
    try {
      let res = await agent.TargetPromotionToolQuestionnaire.list();
      runInAction(() => {
        res.forEach((question) => {
          this.questionsRegistry.set(question.id, question);
        });
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isFetchingQuestions = false;
      });
    }
  };

  get questions() {
    return Array.from(this.questionsRegistry.values());
  }

  addOrEditQuestions = async (questions) => {
    this.isEditingQuestions = true;
    let res = null;
    try {
      res = await agent.TargetPromotionToolQuestionnaire.edit(questions);
      runInAction(() => {
        this.questionsRegistry.clear();
        this.fetchQuestions();
        toast.success("Questionnaire Updated.");
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isEditingQuestions = false;
      });
    }
  };
}
