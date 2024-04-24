import { observer } from "mobx-react-lite";
import { Divider } from "primereact/divider";
import React, { useContext, useState } from "react";
import { FcComments } from "react-icons/fc";
import { RootStoreContext } from "../../../RootStore";
import AuthorTag from "../../../Shared/TagGenerators/AuthorTag/AuthorTag";
import CommentTags from "../../../Shared/TagGenerators/CommentTags/CommentTags";

const Comment = ({ id }) => {
  const rootStore = useContext(RootStoreContext);
  const { fetchComment, isFetchingComment, getComment } =
    rootStore.commentStore;
  const [comment, setComment] = useState({});
  useState(() => {
    fetchComment(id);
  });

  useState(() => {
    setComment(getComment(id));
  });

  console.log("comment", comment);

  if (isFetchingComment) {
    return <div>Fetching Comment...</div>;
  }

  return (
    <div className="flex flex-column w-full border-1 border-50 p-2 border-round-md text-color">
      <div className="flex text-xl font-semibold w-full border-round-md m-2 align-items-center gap-2">
        <div className="flex">
          <FcComments />
        </div>
        <div className="flex">{comment?.topic}</div>
      </div>
      <div className="flex w-full align-items-center border-round-md">
        <div className="flex w-full gap-2">
          <div className="flex">
            <AuthorTag userId={comment?.createdById} />
          </div>
          <div className="flex">on 15/05/2024</div>
        </div>
        <div className="flex justify-content-end w-full">
          <CommentTags tags={comment?.tags} />{" "}
        </div>
      </div>

      <div className="flex w-full">
        <Divider />
      </div>
      <div className="flex w-full pl-2 line-height-3">
        {comment?.description}
      </div>
    </div>
  );
};

export default observer(Comment);
