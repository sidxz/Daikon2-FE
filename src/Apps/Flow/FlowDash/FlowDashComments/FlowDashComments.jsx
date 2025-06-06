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
import CommentTags from "../../../../Shared/TagGenerators/CommentTags/CommentTags";
import { AppUserResolver } from "../../../../Shared/VariableResolvers/AppUserResolver";
import EditCommentSidebar from "../../../Comments/Comment/components/EditCommentSidebar";
import { cleanupAndParse } from "../../../Comments/Shared/HtmlSanitization";
import FlowDashReplies from "./FlowDashReplies";

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
  const { getIdFromUserFullName, getUserFullNameById } = AppUserResolver();

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

  let commentPanelHeader = (
    <div className="flex flex-column w-full align-items-start gap-3">
      <div className="flex gap-2 text-xs text-bluegray-500 font-normal">
        <div className="flex">{getUserFullNameById(comment?.createdById)}</div>
        <div className="flex">
          <FDate timestamp={comment?.dateCreated} color="#8191a6" />
        </div>
      </div>
      <div className="flex">{comment?.topic}</div>
      <div className="flex gap-1">
        <div className="flex">
          <CommentTags tags={comment?.tags} />{" "}
        </div>
        <div className="flex align-items-center gap-1">
          <Button
            icon="pi pi-ellipsis-h"
            className="p-button-sm p-0 m-0 ml-1 mr-2"
            outlined
            severity="secondary"
            onClick={(event) => commentMenu.current.toggle(event)}
            aria-controls="popup_menu_left"
            aria-haspopup
          />
        </div>
      </div>
    </div>
  );

  let commentRender = (
    <div className="flex flex-column w-full text-color">
      <div className="flex w-full flex-column">
        <Panel
          collapsed={true}
          header={commentPanelHeader}
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

          <div className="flex w-full pl-1 m-0">
            {cleanupAndParse(comment?.description)}
          </div>
          <div className="flex w-full align-items-center">
            <div className="flex mt-2 align-items-center">
              <Inplace
                pt={{
                  closeButton: { className: "p-button-sm border-1" },
                }}
              >
                <InplaceDisplay>
                  <div className="flex gap-1 align-items-center">
                    <div className="flex w-full align-items-center">
                      <span className="pi pi-comment"></span>
                    </div>
                    <div className="flex w-full align-items-center">
                      {comment.replies.length}
                    </div>
                  </div>
                </InplaceDisplay>
                <InplaceContent>
                  <div className="flex w-full">
                    <FlowDashReplies
                      comment={comment}
                      setComment={setComment}
                    />
                  </div>
                </InplaceContent>
              </Inplace>
            </div>
          </div>
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
