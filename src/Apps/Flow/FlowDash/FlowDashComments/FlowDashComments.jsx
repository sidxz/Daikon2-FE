import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { Inplace, InplaceContent, InplaceDisplay } from "primereact/inplace";
import { Menu } from "primereact/menu";
import { Panel } from "primereact/panel";
import { Sidebar } from "primereact/sidebar";
import { Skeleton } from "primereact/skeleton";
import React, { useContext, useRef, useState } from "react";
import FDate from "../../../../Library/FDate/FDate";
import { RootStoreContext } from "../../../../RootStore";
import AuthorTag from "../../../../Shared/TagGenerators/AuthorTag/AuthorTag";
import CommentTags from "../../../../Shared/TagGenerators/CommentTags/CommentTags";
import EditCommentSidebar from "../../../Comments/Comment/components/EditCommentSidebar";
import Replies from "../../../Comments/Replies/Replies";
import { cleanupAndParse } from "../../../Comments/Shared/HtmlSanitization";

const FlowDashComments = ({ id }) => {
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
    <div className="flex flex-column w-full text-color">
      <div className="flex w-full flex-column">
        <Panel
          header={comment?.topic}
          style={{
            borderColor: "#f1f3f5",
            borderRadius: "0.5rem",
            border: "1px solid #f1f3f5",
          }}
          toggleable
        >
          <div className="flex w-full align-items-center">
            <div className="flex justify-content-end">
              <Menu
                model={commentMenuItems}
                popup
                ref={commentMenu}
                id={"menu_comment_" + comment?.id}
              />
            </div>
          </div>
          <div className="flex w-full pl-1 align-items-center gap-1">
            <div className="flex">
              <CommentTags tags={comment?.tags} />{" "}
            </div>
          </div>

          <div className="flex w-full pl-1">
            {cleanupAndParse(comment?.description)}
          </div>
          <div className="flex w-full align-items-center">
            <div className="flex w-full align-items-center gap-3">
              <div className="flex w-full">
                <AuthorTag userId={comment?.createdById} />
              </div>
              <div className="flex text-sm text-gray-500 font-normal">
                <FDate timestamp={comment?.dateCreated} color="#8191a6" />
              </div>

              <div className="flex align-items-center">
                <Inplace>
                  <InplaceDisplay>
                    <div className="flex gap-1 align-items-center">
                      <div className="flex">
                        <span className="pi pi-comment"></span>
                      </div>
                      <div className="flex">{comment.replies.length}</div>
                    </div>
                  </InplaceDisplay>
                  <InplaceContent>
                    <div className="flex w-full pl-6">
                      <Replies comment={comment} setComment={setComment} />
                    </div>
                  </InplaceContent>
                </Inplace>
              </div>

              <div className="flex align-items-center gap-1">
                <Button
                  icon="pi pi-ellipsis-h"
                  className="p-button p-0 m-0 ml-1 mr-2"
                  outlined
                  severity="secondary"
                  onClick={(event) => commentMenu.current.toggle(event)}
                  aria-controls="popup_menu_left"
                  aria-haspopup
                />
              </div>
            </div>
          </div>

          <div></div>
        </Panel>
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

export default observer(FlowDashComments);
