import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Menu } from "primereact/menu";
import { Sidebar } from "primereact/sidebar";
import React, { useContext, useRef, useState } from "react";
import { FcComments } from "react-icons/fc";
import FDate from "../../../Library/FDate/FDate";
import { RootStoreContext } from "../../../RootStore";
import AuthorTag from "../../../Shared/TagGenerators/AuthorTag/AuthorTag";
import CommentTags from "../../../Shared/TagGenerators/CommentTags/CommentTags";
import EditCommentSidebar from "./components/EditCommentSidebar";

const Comment = ({ id }) => {
  const rootStore = useContext(RootStoreContext);
  const { fetchComment, isFetchingComment, getComment } =
    rootStore.commentStore;
  const [comment, setComment] = useState({ ...getComment(id) });
  useState(() => {
    fetchComment(id);
  });

  useState(() => {
    setComment(getComment(id));
  });

  const commentMenu = useRef(null);
  const [displayEditSideBar, setDisplayEditSideBar] = useState(false);

  console.log("comment", comment);

  const commentMenuItems = [
    {
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
        },
      ],
    },
  ];

  if (isFetchingComment) {
    return <div>Fetching Comment...</div>;
  }

  let sanitizeHtml = (text) =>
    DOMPurify.sanitize(text, {
      ALLOWED_TAGS: ["strong", "p", "em", "u", "s", "a", "ul", "li"],
    });

  let cleanupAndParse = (text) => {
    let cleaned = sanitizeHtml(text);
    let parsed = <>{parse(cleaned)}</>;
    return parsed;
  };

  return (
    <>
      <div className="flex flex-column w-full border-1 border-50 p-2 border-round-md text-color">
        <div className="flex w-full border-round-md m-2 align-items-center gap-2">
          <div className="flex">
            <FcComments />
          </div>
          <div className="flex flex-grow-1 text-xl font-semibold">
            {comment?.topic}
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
              className="p-button-sm p-0 m-0 mr-2"
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
          <div className="flex justify-content-end w-full">
            <CommentTags tags={comment?.tags} />{" "}
          </div>
        </div>

        <div className="flex w-full">
          <Divider />
        </div>
        <div className="flex w-full pl-2 line-height-3">
          {cleanupAndParse(comment?.description)}
        </div>
      </div>
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
