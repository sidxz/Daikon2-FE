import { observer } from "mobx-react-lite";
import { Divider } from "primereact/divider";
import React, { useContext, useState } from "react";
import { FcComments } from "react-icons/fc";
import { RootStoreContext } from "../../../RootStore";
import AuthorTag from "../../../Shared/TagGenerators/AuthorTag/AuthorTag";
import CommentTags from "../../../Shared/TagGenerators/CommentTags/CommentTags";

const Comment = ({ id }) => {
  console.log("id", id);
  const rootStore = useContext(RootStoreContext);
  const { fetchComment, isFetchingComment, selectedComment } =
    rootStore.commentStore;

  useState(() => {
    fetchComment(id);
  });

  if (isFetchingComment) {
    return <div>Fetching Comment...</div>;
  }

  return (
    <div className="flex flex-column w-full border-1 border-50 p-2 border-round-md">
      <div className="flex text-3xl w-full border-round-md mb-2 align-items-center">
        <FcComments />
        {selectedComment?.topic}
      </div>
      <div className="flex w-full align-items-center border-round-md">
        <div className="flex w-full gap-2">
          <div className="flex">
            <AuthorTag userId={selectedComment?.createdById} />
          </div>
          <div className="flex">on 15/05/2024</div>
        </div>
        <div className="flex justify-content-end w-full">
          <CommentTags tags={selectedComment?.tags} />{" "}
        </div>
      </div>

      <div className="flex w-full">
        <Divider />
      </div>
      <div className="flex w-full pl-2">{selectedComment?.description}</div>
    </div>
  );
};

export default observer(Comment);
