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

      deleteComment: action,
      isDeletingComment: observable,

      getComment: computed,

      addReply: action,
      isAddingReply: observable,

      updateReply: action,
      isUpdatingReply: observable,

      deleteReply: action,
      isDeletingReply: observable,

      workingOnReplyId: observable,
      workingOnCommentId: observable,

      currentCommentTagsHash: observable,
    });
  }

  // Observables
  isFetchingComments = false;
  isFetchingComment = false;
  commentRegistry = new Map();
  isCommentRegistryCacheValid = false;
  isUpdatingComment = false;
  isAddingComment = false;
  isDeletingComment = false;
  isAddingReply = false;
  isUpdatingReply = false;
  isDeletingReply = false;
  workingOnReplyId = null;
  workingOnCommentId = null;
  currentCommentTagsHash = "";

  // Actions

  fetchCommentsByTags = async (tags, inValidateCache = false) => {
    console.log("ACTION fetchCommentsByTags", tags);
    if (inValidateCache) {
      this.isCommentRegistryCacheValid = false;
    }

    this.isFetchingComments = true;
    this.currentCommentTagsHash = tags.join();
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
    this.workingOnCommentId = comment.id;
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
        this.workingOnCommentId = null;
      });
    }
  };

  deleteComment = async (comment) => {
    this.isDeletingComment = true;
    this.workingOnCommentId = comment.id;
    try {
      await CommentAPI.delete(comment.id);
      runInAction(() => {
        this.commentRegistry.delete(comment.id);
        //this.isCommentRegistryCacheValid = false;
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      runInAction(() => {
        this.isDeletingComment = false;
        this.workingOnCommentId = null;
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
      return tags.every((tag) =>
        comment?.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
      );
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
      return tags.some((tag) =>
        comment?.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
      );
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

  updateReply = async (reply) => {
    const commentId = reply.commentId;
    if (!commentId) {
      console.error("No commentId provided for reply");
      return;
    }
    this.isUpdatingReply = true;
    this.workingOnReplyId = reply.id;
    try {
      const updatedReply = await CommentAPI.updateReply(reply);
      runInAction(() => {
        const comment = this.commentRegistry.get(commentId);
        if (comment) {
          const replyIndex = comment.replies.findIndex(
            (r) => r.id === updatedReply.id
          );
          if (replyIndex >= 0) {
            comment.replies[replyIndex] = updatedReply;
            this.commentRegistry.set(commentId, comment);
          }
        }
      });
    } catch (error) {
      console.error("Error updating reply:", error);
    } finally {
      runInAction(() => {
        this.isUpdatingReply = false;
        this.workingOnReplyId = null;
      });
    }
  };

  deleteReply = async (reply) => {
    const commentId = reply.commentId;
    if (!commentId) {
      console.error("No commentId provided for reply");
      return;
    }
    this.isDeletingReply = true;
    this.workingOnReplyId = reply.id;
    try {
      await CommentAPI.deleteReply(reply);
      runInAction(() => {
        const comment = this.commentRegistry.get(commentId);
        if (comment) {
          const replyIndex = comment.replies.findIndex(
            (r) => r.id === reply.id
          );
          if (replyIndex >= 0) {
            comment.replies.splice(replyIndex, 1);
            this.commentRegistry.set(commentId, comment);
          }
        }
      });
    } catch (error) {
      console.error("Error deleting reply:", error);
      throw error;
    } finally {
      runInAction(() => {
        this.isDeletingReply = false;
        this.workingOnReplyId = null;
      });
    }
  };

  // Computed
  get getComment() {
    return (id) => this.commentRegistry.get(id);
  }
}
