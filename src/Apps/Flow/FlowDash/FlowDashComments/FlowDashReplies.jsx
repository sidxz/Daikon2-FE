import { observer } from "mobx-react-lite";
import { Divider } from "primereact/divider";
import React from "react";
import AddReply from "../../../Comments/Replies/components/AddReply";
import FlowDashReply from "./FlowDashReply";
const FlowDashReplies = ({ comment, setComment }) => {
  return (
    <div className="flex flex-column w-full border-round-md text-color border-0">
      <div className="flex w-full border-round-md align-items-center m-0 p-0">
        <Divider align="right" className="m-0 p-0"></Divider>
      </div>
      <div className="flex w-full border-round-md align-items-center">
        <AddReply comment={comment} setComment={setComment} />
      </div>
      <div className="flex flex-column gap-2 w-full border-round-md align-items-center border-left-1 border-50">
        {comment.replies &&
          comment.replies.map((reply, index) => {
            return (
              <FlowDashReply
                key={reply.id}
                reply={reply}
                comment={comment}
                setComment={setComment}
              />
            );
          })}
      </div>
    </div>
  );
};

export default observer(FlowDashReplies);
