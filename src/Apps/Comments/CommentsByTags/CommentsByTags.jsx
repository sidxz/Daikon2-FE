import { observer } from "mobx-react-lite";
import { Card } from "primereact/card";
import React, { useContext, useEffect } from "react";
import PleaseWait from "../../../Library/PleaseWait/PleaseWait";
import { RootStoreContext } from "../../../RootStore";
import CommentTags from "../../../Shared/TagGenerators/CommentTags/CommentTags";
import Comment from "../Comment/Comment";

const CommentsByTags = ({ tags, any = true }) => {
  const rootStore = useContext(RootStoreContext);
  const {
    fetchCommentsByTags,
    isFetchingComments,
    commentListByTagsAny,
    commentListByTags,
    isCommentRegistryCacheValid,
    commentRegistry,
    currentCommentTagsHash,
  } = rootStore.commentStore;

  useEffect(() => {
    if (!isCommentRegistryCacheValid || currentCommentTagsHash != tags.join()) {
      // console.log("fetchCommentsByTags <---->");
      fetchCommentsByTags(tags);
    }
  }, [
    fetchCommentsByTags,
    tags,
    commentRegistry,
    isCommentRegistryCacheValid,
    currentCommentTagsHash,
  ]);

  if (isFetchingComments)
    return (
      <div className="flex flex-column w-full card-container">
        <PleaseWait />
      </div>
    );

  let comments = any ? commentListByTagsAny(tags) : commentListByTags(tags);

  if (comments.length === 0)
    return (
      <div className="flex w-full text-color-secondary">
        <Card
          className="w-full text-color-secondary"
          title="No ongoing discussions found."
          subTitle={<CommentTags tags={tags} />}
          // footer={footer}
          // header={header}
        >
          <p className="m-0 text-color-secondary">
            Engage with the community by starting a new discussion! Simply click
            the "New Discussion" button to begin. Keep in mind that discussions
            visible to everyone. You can filter discussions by tags, which are
            displayed above. When creating a new discussion, be sure to add
            relevant tags to help others find and join your conversation.
          </p>
        </Card>
      </div>
    );

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
