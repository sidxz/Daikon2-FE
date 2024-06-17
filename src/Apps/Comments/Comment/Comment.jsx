import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { Menu } from "primereact/menu";
import { Sidebar } from "primereact/sidebar";
import { Skeleton } from "primereact/skeleton";
import React, { useContext, useRef, useState } from "react";
import { FcComments } from "react-icons/fc";
import FDate from "../../../Library/FDate/FDate";
import { RootStoreContext } from "../../../RootStore";
import AuthorTag from "../../../Shared/TagGenerators/AuthorTag/AuthorTag";
import CommentTags from "../../../Shared/TagGenerators/CommentTags/CommentTags";
import Replies from "../Replies/Replies";
import { cleanupAndParse } from "../Shared/HtmlSanitization";
import EditCommentSidebar from "./components/EditCommentSidebar";

const Comment = ({ id }) => {
  const rootStore = useContext(RootStoreContext);
  const {
    fetchComment,
    isFetchingComment,
    getComment,
    workingOnCommentId,
    deleteComment,
    isDeletingComment,
    isUpdatingComment,
  } = rootStore.commentStore;
  const { appVars, user } = rootStore.authStore;
  const [comment, setComment] = useState({ ...getComment(id) });
  useState(() => {
    fetchComment(id);
  });

  useState(() => {
    setComment(getComment(id));
  });

  const commentMenu = useRef(null);
  const [displayEditSideBar, setDisplayEditSideBar] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteComment(comment);
      setComment(null);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  if (!comment) {
    return <></>;
  }

  const commentMenuItems = [];
  if (user.id === comment.createdById) {
    commentMenuItems.push({
      items: [
        {
          label: "Edit",
          icon: "pi pi-pencil",
          command: () => {
            setDisplayEditSideBar(true);
          },
        },
        {
          label: "Delete",
          icon: "pi pi-times",
          command: () => {
            confirmDialog({
              message: "Do you want to delete this record?",
              header: "Delete Confirmation",
              icon: "pi pi-info-circle",
              defaultFocus: "reject",
              acceptClassName: "p-button-danger",
              accept: () => handleDelete(),
              reject: () => {
                console.log("reject");
              },
            });
          },
        },
      ],
    });
  } else {
    commentMenuItems.push({
      items: [
        {
          label: "No available actions",
          icon: "pi pi-exclamation-triangle",
          command: () => {
            console.log("No available actions");
          },
        },
      ],
    });
  }

  let skeletonRender = (
    <div className="flex w-full justify-content-center">
      <Skeleton height="6rem" className="mb-2"></Skeleton>
    </div>
  );

  let commentRender = (
    <div className="flex flex-column w-full border-1 border-50 p-2 border-round-md text-color">
      <div className="flex w-full border-round-md m-2 align-items-center gap-2">
        <div className="flex">
          <FcComments />
        </div>
        <div className="flex flex-grow-1 text-xl font-semibold">
          {comment?.topic}
        </div>

        <div className="flex">
          <CommentTags tags={comment?.tags} />{" "}
        </div>

        <div className="flex justify-content-end">
          <Menu
            model={commentMenuItems}
            popup
            ref={commentMenu}
            id={"menu_comment_" + comment?.id}
          />
          <Button
            icon="pi pi-ellipsis-h"
            className="p-button p-0 m-0 mr-2"
            outlined
            severity="secondary"
            onClick={(event) => commentMenu.current.toggle(event)}
            aria-controls="popup_menu_left"
            aria-haspopup
          />
        </div>
      </div>
      <div className="flex w-full align-items-center border-round-md">
        <div className="flex w-full gap-2 align-items-center">
          <div className="flex">
            <AuthorTag userId={comment?.createdById} />
          </div>
          <div className="flex text-sm text-gray-500 font-normal">
            <FDate timestamp={comment?.dateCreated} color="#8191a6" />
          </div>
        </div>
      </div>

      <div className="flex w-full"></div>
      <div className="flex flex-column w-full pl-4 line-height-3">
        {cleanupAndParse(comment?.description)}
      </div>
      <div className="flex w-full pl-6">
        <Replies comment={comment} setComment={setComment} />
      </div>
    </div>
  );

  return (
    <>
      {isFetchingComment || (isDeletingComment && workingOnCommentId === id)
        ? skeletonRender
        : commentRender}
      <Sidebar
        visible={displayEditSideBar}
        position="right"
        onHide={() => setDisplayEditSideBar(false)}
        className="p-sidebar-md"
        header={
          <div className="text-lg font-bold">
            <i className="pi pi pi-pencil pr-2" />
            Edit
          </div>
        }
      >
        <EditCommentSidebar
          comment={comment}
          setComment={setComment}
          closeSideBar={() => setDisplayEditSideBar(false)}
        />
      </Sidebar>
    </>
  );
};

export default observer(Comment);
