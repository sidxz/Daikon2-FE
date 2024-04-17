import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import { RootStoreContext } from "../../../RootStore";
import Comment from "../Comment/Comment";

const CommentsByTags = ({ tags }) => {
  console.log("tags", tags);

  const rootStore = useContext(RootStoreContext);
  const { fetchCommentsByTags, isFetchingComments, commentListByTags } =
    rootStore.commentStore;

  useEffect(() => {
    fetchCommentsByTags(tags);
  }, [fetchCommentsByTags, tags]);

  console.log(commentListByTags(tags));

  let comments = commentListByTags(tags);

  let commentsRender = comments.map((comment) => {
    return <Comment key={comment.id} id={comment.id} />;
  });

  return (
    <>
      <div className="flex flex-column w-full card-container">
        <div className="table-header flex flex-row w-full shadow-0 fadein">
          <div className="flex justify-content-end w-full">
            {/* <div className="flex flex-grow min-w-max">
              <Button
                type="button"
                icon="pi pi-plus"
                label="New Discussion"
                className="p-button-text p-button-sm"
                //onClick={() => setVisible(true)}
              />
            </div> */}
          </div>
        </div>
        <div className="flex w-full"></div>
        {commentsRender}
      </div>
    </>
  );
};

export default observer(CommentsByTags);
