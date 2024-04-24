import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import CommentAPI from "../api/CommentAPI";

export default class CommentStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      fetchCommentsByTags: action,
      fetchComment: action,
      isFetchingComments: observable,
      isFetchingComment: observable,
      commentRegistry: observable,
      isCommentRegistryCacheValid: observable,
      commentListByTags: action,
      commentListByTagsAny: action,

      getComment: computed,
    });
  }

  // Observables
  isFetchingComments = false;
  isFetchingComment = false;
  commentRegistry = new Map();
  isCommentRegistryCacheValid = false;

  // Actions

  fetchCommentsByTags = async (tags, inValidateCache = false) => {
    if (inValidateCache) {
      this.isCommentRegistryCacheValid = false;
    }
    if (this.isCommentRegistryCacheValid) {
      return;
    }
    this.isFetchingComments = true;
    try {
      const comments = await CommentAPI.listByTags(tags);
      console.log("comments", comments);
      runInAction(() => {
        comments.forEach((comment) => {
          this.commentRegistry.set(comment.id, comment);
        });
        this.isCommentRegistryCacheValid = true;
      });
    } catch (error) {
      console.error("Error fetching genes:", error);
    } finally {
      runInAction(() => {
        this.isFetchingComments = false;
      });
    }
  };

  commentListByTags = (tags) => {
    return Array.from(this.commentRegistry.values()).filter((comment) =>
      tags.every((tag) => comment.tags.includes(tag))
    );
  };

  commentListByTagsAny = (tags) => {
    return Array.from(this.commentRegistry.values()).filter((comment) =>
      tags.some((tag) => comment.tags.includes(tag))
    );
  };

  fetchComment = async (id, inValidateCache = false) => {
    if (inValidateCache) {
      this.isCommentRegistryCacheValid = false;
    }

    this.isFetchingComment = true;
    if (this.isCommentRegistryCacheValid) {
      // find comment in registry and return if found
      const comment = this.commentRegistry.get(id);
      if (comment) {
        this.isFetchingComment = false;
      }
    }
    try {
      const comment = await CommentAPI.getById(id);
      runInAction(() => {
        this.commentRegistry.set(comment.id, comment);
        this.isCommentRegistryCacheValid = true;
      });
    } catch (error) {
      console.error("Error fetching comment:", error);
    } finally {
      runInAction(() => {
        this.isFetchingComment = false;
      });
    }
  };

  // Computed
  get getComment() {
    return (id) => this.commentRegistry.get(id);
  }
}
