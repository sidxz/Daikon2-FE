import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import Loading from "../../../Library/Loading/Loading";
import { RootStoreContext } from "../../../RootStore";
import Comment from "../Comment/Comment";

const CommentsByTags = ({ tags }) => {
  console.log("tags", tags);

  const rootStore = useContext(RootStoreContext);
  const {
    fetchCommentsByTags,
    isFetchingComments,
    commentListByTags,
    isCommentRegistryCacheValid,
    commentRegistry,
  } = rootStore.commentStore;

  useEffect(() => {
    console.log("useEffect CommentsByTags");
    if (!isCommentRegistryCacheValid) fetchCommentsByTags(tags);
  }, [fetchCommentsByTags, tags, commentRegistry, isCommentRegistryCacheValid]);

  if (isFetchingComments) return <Loading message={"Fetching comments..."} />;

  console.log(commentListByTags(tags));

  let comments = commentListByTags(tags);

  let commentsRender = comments.map((comment) => {
    return <Comment key={comment.id} id={comment.id} />;
  });

  return (
    <>
      <div className="flex flex-column w-full card-container">
        <div className="flex flex-column w-full gap-2">{commentsRender}</div>
      </div>
    </>
  );
};

export default observer(CommentsByTags);
