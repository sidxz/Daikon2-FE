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

      addComment: action,
      isAddingComment: observable,

      updateComment: action,
      isUpdatingComment: observable,

      getComment: computed,

      addReply: action,
      isAddingReply: observable,
    });
  }

  // Observables
  isFetchingComments = false;
  isFetchingComment = false;
  commentRegistry = new Map();
  isCommentRegistryCacheValid = false;
  isUpdatingComment = false;
  isAddingComment = false;
  isAddingReply = false;

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

  addComment = async (comment) => {
    this.isAddingComment = true;
    try {
      const newComment = await CommentAPI.create(comment);
      runInAction(() => {
        newComment.replies = [];
        this.commentRegistry.set(newComment.id, newComment);
        this.isCommentRegistryCacheValid = false;
      });
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      runInAction(() => {
        this.isAddingComment = false;
      });
    }
  };

  updateComment = async (comment) => {
    this.isUpdatingComment = true;
    try {
      const updatedComment = await CommentAPI.update(comment);
      runInAction(() => {
        this.commentRegistry.set(updatedComment.id, updatedComment);
        //this.isCommentRegistryCacheValid = false;
      });
    } catch (error) {
      console.error("Error updating comment:", error);
    } finally {
      runInAction(() => {
        this.isUpdatingComment = false;
      });
    }
  };

  commentListByTags = (tags) => {
    if (tags.length === 0) {
      return;
    }

    return Array.from(this.commentRegistry.values()).filter((comment) => {
      if (comment?.tags === undefined) {
        return;
      }
      return tags.every((tag) => comment?.tags.includes(tag));
    });
  };

  commentListByTagsAny = (tags) => {
    if (tags.length === 0) {
      return;
    }
    return Array.from(this.commentRegistry.values()).filter((comment) => {
      if (comment?.tags === undefined) {
        return;
      }
      return tags.some((tag) => comment?.tags.includes(tag));
    });
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

  addReply = async (reply) => {
    const { commentId } = reply;
    if (!commentId) {
      console.error("No commentId provided for reply");
      return;
    }
    this.isAddingReply = true;
    try {
      const newReply = await CommentAPI.reply(reply);
      runInAction(() => {
        const comment = this.commentRegistry.get(commentId);
        if (comment) {
          comment.replies.push(newReply);
          this.commentRegistry.set(commentId, comment);
          //this.isCommentRegistryCacheValid = false;
        }
      });
    } catch (error) {
      console.error("Error adding reply:", error);
    } finally {
      runInAction(() => {
        this.isAddingReply = false;
      });
    }
  };

  // Computed
  get getComment() {
    return (id) => this.commentRegistry.get(id);
  }
}
