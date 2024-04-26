import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { Sidebar } from "primereact/sidebar";
import React, { useRef, useState } from "react";
import FDate from "../../../../Library/FDate/FDate";
import AuthorTag from "../../../../Shared/TagGenerators/AuthorTag/AuthorTag";
import { cleanupAndParse } from "../../Shared/HtmlSanitization";
const Reply = ({ reply }) => {
  const replyMenu = useRef(null);

  const [displayEditSideBar, setDisplayEditSideBar] = useState(false);

  const replyMenuItems = [
    {
      label: "Reply options",
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

  return (
    <>
      <div className="flex w-full gap-2 align-items-center fadein animation-duration-1000 border-1 border-round-md border-gray-50">
        <div className="flex  w-max align-items-center">
          <div className="flex  w-max">
            <AuthorTag userId={reply?.createdById} />
          </div>
        </div>

        <div className="flex flex-grow-1 pl-2 surface-50 border-1 border-round-md border-gray-50">
          <div className="flex flex-grow-1 ">
            {cleanupAndParse(reply?.body)}
          </div>
          <div className="flex flex-column justify-content-center border-0">
            <div className="flex text-xs text-gray-500 font-normal pr-2">
              <FDate timestamp={reply?.dateCreated} color="#8191a6" />
            </div>
            <div className="flex border-0">
              <Menu
                model={replyMenuItems}
                popup
                ref={replyMenu}
                id={"menu_reply_" + reply?.id}
                pt={{
                  root: { className: "p-1 m-0" },
                  menu: { className: "text-sm" },
                  label: { className: "text-sm" },
                }}
              />
              <Button
                icon="pi pi-ellipsis-h"
                className="p-button p-0 m-0 mr-2"
                text
                severity="secondary"
                onClick={(event) => replyMenu.current.toggle(event)}
                aria-controls="popup_menu_left"
                aria-haspopup
              />
            </div>
          </div>
        </div>
      </div>
      <Sidebar
        visible={displayEditSideBar}
        position="right"
        onHide={() => setDisplayEditSideBar(false)}
        className="p-sidebar-sm"
        header={
          <div className="text-lg font-bold">
            <i className="pi pi pi-pencil pr-2" />
            Edit
          </div>
        }
      >
        {/* <EditCommentSidebar
          comment={comment}
          setComment={setComment}
          closeSideBar={() => setDisplayEditSideBar(false)}
        /> */}
      </Sidebar>
    </>
  );
};

export default observer(Reply);
