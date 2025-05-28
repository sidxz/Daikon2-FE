import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { Skeleton } from "primereact/skeleton";
import React, { useContext, useRef, useState } from "react";
import FDate from "../../../../../Library/FDate/FDate";
import { RootStoreContext } from "../../../../../RootStore";
import AuthorTag from "../../../../../Shared/TagGenerators/AuthorTag/AuthorTag";
import { cleanupAndParse } from "../../../../Comments/Shared/HtmlSanitization";

const PDTFIssue = ({ issue }) => {
  const issueMenu = useRef(null);

  const [displayEditSideBar, setDisplayEditSideBar] = useState(false);

  const rootStore = useContext(RootStoreContext);

  const handleDeleteIssue = async () => {
    try {
      console.log("Deleting issue...");
    } catch (error) {
      console.error("Error deleting issue:", error);
    }
  };

  const issueMenuItems = [];
  //if (user.id === issue.createdById)
  if (true) {
    issueMenuItems.push({
      label: "Issue options",
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
              accept: () => handleDeleteIssue(),
              reject: () => {
                console.log("reject");
              },
            });
          },
        },
      ],
    });
  } else {
    issueMenuItems.push({
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
      <Skeleton height="4rem" className="mb-2"></Skeleton>
    </div>
  );

  let issueRender = (
    <div className="flex flex-column w-full gap-2 align-items-center fadein animation-duration-1000 border-1 border-round-md border-orange-100">
      <div className="flex align-items-left w-full pl-2 text-xs gap-2 align-items-center">
        <div className="flex">
          <AuthorTag userId={issue?.createdById} displayInitials={false} />
        </div>
        <div className="flex text-gray-500 font-normal pr-2">
          <FDate timestamp={issue?.dateCreated} color="#8191a6" />
        </div>
      </div>
      <div className="flex flex-grow-1 pl-2 bg-orange-50 border-0 border-round-md 	">
        <div className="flex flex-grow-1 ">{cleanupAndParse(issue?.body)}</div>
        <div className="flex flex-column justify-content-center border-0">
          <div className="flex border-0">
            <Menu
              model={issueMenuItems}
              popup
              ref={issueMenu}
              id={"menu_issue_" + issue?.id}
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
              onClick={(event) => issueMenu.current.toggle(event)}
              aria-controls="popup_menu_left"
              aria-haspopup
            />
          </div>
        </div>
      </div>
    </div>
  );

  return <div className="flex flex-column">{issueRender}</div>;
};
export default observer(PDTFIssue);
