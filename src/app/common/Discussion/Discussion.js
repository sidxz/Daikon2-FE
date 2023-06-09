import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { observer } from "mobx-react-lite";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Chips } from "primereact/chips";
import { Divider } from "primereact/divider";
import { Editor } from "primereact/editor";
import { Fieldset } from "primereact/fieldset";
import { OverlayPanel } from "primereact/overlaypanel";
import { Sidebar } from "primereact/sidebar";
import { Tag } from "primereact/tag";
import React, { useContext, useEffect, useRef, useState } from "react";
import Loading from "../../layout/Loading/Loading";
import { RootStoreContext } from "../../stores/rootStore";
import FDate from "../FDate/FDate";
import StartDiscussion from "./StartDiscussion";

const Discussion = ({ reference, section, tagsFilters = [] }) => {
  const rootStore = useContext(RootStoreContext);
  const {
    fetchDiscussions,
    loadingDiscussions,
    discussions,
    newDiscussion,
    postingDiscussion,
    editDiscussion,
    editingDiscussion,
    newReply,
  } = rootStore.discussionStore;
  const { user } = rootStore.userStore;

  useEffect(() => {
    fetchDiscussions(reference);
  }, [fetchDiscussions, reference]);

  /* local variables */

  const [displayDiscussionDialog, setDisplayDiscussionDialog] = useState(false);
  const [userReplyValue, setuserReplyValue] = useState({});
  const [displayReplyBox, setDisplayReplyBox] = useState({});

  const [displayEditBox, setDisplayEditBox] = useState({});
  const [editBoxValue, setEditBoxValue] = useState({});
  const [tagsFilter, setTagsFilter] = useState([...tagsFilters]);
  const opFilters = useRef(null);

  const displayAllDiscussions = () => {
    setDisplayDiscussionDialog(true);
  };

  if (loadingDiscussions) {
    return <Loading />;
  }

  console.log(discussions);

  let sanitizeHtml = (text) =>
    DOMPurify.sanitize(text, {
      ALLOWED_TAGS: ["strong", "p", "em", "u", "s", "a", "ul", "li"],
    });

  let cleanupAndParse = (text) => {
    let cleaned = sanitizeHtml(text);
    let parsed = <React.Fragment>{parse(cleaned)}</React.Fragment>;
    return parsed;
  };

  const headerOfTextEditor = (
    <span className="ql-formats">
      <button className="ql-bold" aria-label="Bold"></button>
      <button className="ql-italic" aria-label="Italic"></button>
      <button className="ql-underline" aria-label="Underline"></button>
      <button className="ql-strike" aria-label="Strike"></button>
      <button className="ql-link" aria-label="Link"></button>
      <button className="ql-list" value="bullet" aria-label="Bullet"></button>
    </span>
  );

  let mapReplyValues = (id, value) => {
    let tempValue = { ...userReplyValue };
    tempValue[id] = value;
    setuserReplyValue(tempValue);
  };

  let mapDisplayReplyBox = (id, value) => {
    mapReplyValues(id, "");
    let tempValue = { ...displayReplyBox };
    tempValue[id] = value;
    setDisplayReplyBox(tempValue);
  };

  let mapEditBoxValues = (id, value) => {
    let tempValue = { ...editBoxValue };
    tempValue[id] = value;
    setEditBoxValue(tempValue);
  };

  let mapDisplayEditBox = (discussion, visible) => {
    mapEditBoxValues(discussion.id, discussion.description);
    let tempValue = { ...displayEditBox };
    tempValue[discussion.id] = visible;
    setDisplayEditBox(tempValue);
  };

  let subtitleTemplate = (discussion) => {
    return (
      <div style={{ fontSize: "smaller", color: "#999999" }}>
        <Avatar
          icon="pi pi-user"
          size="small"
          style={{ width: "1rem", height: "1rem" }}
        />{" "}
        {discussion.postedBy} on <FDate timestamp={discussion.timestamp} />
      </div>
    );
  };

  let submitEditDiscussion = (discussion) => {
    if (discussion.description === editBoxValue[discussion.id]) {
      mapDisplayEditBox(discussion, false);
      return;
    }

    editDiscussion({
      ...discussion,
      description: sanitizeHtml(editBoxValue[discussion.id]),
    }).then((res) => {
      if (res !== null) mapDisplayEditBox(discussion, false);
    });
  };

  let submitReply = (discussion) => {
    let replyV = userReplyValue[discussion.id]?.trim();

    if (replyV === "" || replyV === undefined || replyV === null) {
      mapDisplayReplyBox(discussion.id, false);
      return;
    }
    newReply(discussion, {
      discussionId: discussion.id,
      body: sanitizeHtml(replyV),
    }).then((res) => {
      if (res !== null) {
        mapDisplayReplyBox(discussion.id, false);
        mapEditBoxValues(discussion.id, "");
      }
    });
  };

  // from the discussion tags property generate the list of tags
  let generateTags = (discussion) => {
    let tags = discussion.tags;
    let formattedTags = tags.map((tag) => {
      return (
        <div className="flex inline">
          <Tag
            style={{ background: "#828AAD", padding: "0.1rem 0.2rem" }}
            value={tag}
            key={tag}
          ></Tag>
        </div>
      );
    });
    return formattedTags;
  };

  let titleTemplate = (discussion) => {
    return (
      <div className="flex flex-row gap-2">
        {discussion.topic}{" "}
        <sup>
          <div className="inline flex flex-row gap-2">
            <div className="flex inline">
              <Tag
                style={{ background: "#76CE86", padding: "0.1rem 0.2rem" }}
                value={discussion.section}
              />
            </div>
            {generateTags(discussion)}
          </div>
        </sup>
      </div>
    );
  };

  let formattedDiscussions =
    discussions.length > 0 ? (
      discussions.map((discussion) => {
        // filter by tags
        if (tagsFilter.length > 0) {
          let tags = discussion.tags;
          let found = false;
          tags.forEach((tag) => {
            if (tagsFilter.includes(tag)) {
              found = true;
            }
          });
          if (!found) {
            return <React.Fragment />;
          }
        }

        let formattedReplies = <React.Fragment />;
        if (discussion.replies.length > 0) {
          formattedReplies = discussion.replies.map((reply) => {
            return (
              <div key={reply.id}>
                <Divider align="left">
                  <div className="p-d-inline-flex p-ai-center">
                    {subtitleTemplate(reply)}
                  </div>
                </Divider>
                <p>{cleanupAndParse(reply.body)}</p>
              </div>
            );
          });
        }

        return (
          <Card
            title={titleTemplate(discussion)}
            subTitle={subtitleTemplate(discussion)}
            key={discussion.id}
            style={{ marginTop: "10px", width: "100%" }}
          >
            <p>
              {displayEditBox[discussion.id] ? (
                <React.Fragment>
                  <Editor
                    headerTemplate={headerOfTextEditor}
                    value={editBoxValue[discussion.id]}
                    onTextChange={(e) =>
                      mapEditBoxValues(discussion.id, e.htmlValue)
                    }
                    rows={2}
                    style={{ width: "100%" }}
                    autoResize
                    autoFocus
                  />
                  <Button
                    className="p-button-rounded"
                    style={{
                      background: "#28477f",
                      border: "0px solid #28477f",
                      padding: "0.4rem 0.6rem",
                      float: "right",
                      marginTop: "0.2rem",
                      fontSize: "small",
                    }}
                    label="Save Edit"
                    icon="pi pi-reply"
                    onClick={() => {
                      submitEditDiscussion(discussion);
                    }}
                    loading={editingDiscussion}
                  />
                </React.Fragment>
              ) : (
                <p style={{ marginBottom: "0.2rem", whiteSpace: "pre-line" }}>
                  {cleanupAndParse(discussion.description)}
                </p>
              )}
              <br />

              {discussion.postedBy === user.email &&
                (!displayEditBox[discussion.id] ? (
                  <Button
                    label="Edit"
                    className="p-button-link"
                    icon="ri-edit-2-line"
                    style={{ padding: "0.4rem 0.6rem", float: "right" }}
                    onClick={() => mapDisplayEditBox(discussion, true)}
                  />
                ) : (
                  <Button
                    label="Cancel Edit"
                    className="p-button-link"
                    icon="ri-close-circle-line"
                    style={{ padding: "0.4rem 0.6rem", float: "right" }}
                    onClick={() => mapDisplayEditBox(discussion, false)}
                  />
                ))}
              <Button
                label="Reply"
                className="p-button-link"
                icon="ri-reply-line"
                style={{ padding: "0.4rem 0.6rem", float: "right" }}
                onClick={() => mapDisplayReplyBox(discussion.id, true)}
              />
            </p>
            <Divider align="left" type="dashed">
              <b>Replies</b>
            </Divider>
            <div style={{ marginLeft: "50px" }}>
              {displayReplyBox[discussion.id] && (
                <React.Fragment>
                  <Editor
                    headerTemplate={headerOfTextEditor}
                    value={userReplyValue[discussion.id]}
                    onTextChange={(e) =>
                      mapReplyValues(discussion.id, e.htmlValue)
                    }
                    rows={2}
                    style={{ width: "100%" }}
                    autoResize
                    autoFocus
                  />
                  <Button
                    className="p-button-rounded"
                    style={{
                      background: "#28477f",
                      border: "0px solid #28477f",
                      padding: "0.4rem 0.6rem",
                      float: "right",
                      marginTop: "0.2rem",
                      fontSize: "small",
                    }}
                    label="Reply"
                    icon="pi pi-reply"
                    onClick={() => submitReply(discussion)}
                  />
                </React.Fragment>
              )}
              {formattedReplies}
            </div>

            <br />
          </Card>
        );
      })
    ) : (
      <React.Fragment />
    );

  return (
    <React.Fragment>
      <Sidebar
        visible={displayDiscussionDialog}
        position="right"
        style={{ width: "30em", overflowX: "auto" }}
        onHide={() => setDisplayDiscussionDialog(false)}
      >
        <h2>Start a new topic.</h2>

        <Tag
          style={{
            background: "#76CE86",
            padding: "0.1rem 0.5rem",
            fontSize: "x-large",
          }}
          value={section}
        />
        <Tag
          style={{
            background: "#28477f",
            padding: "0.1rem 0.5rem",
            fontSize: "x-large",
            marginLeft: "1rem",
          }}
          value={reference}
        />
        <br />
        <br />
        <StartDiscussion
          reference={reference}
          section={section}
          newDiscussion={newDiscussion}
          postingDiscussion={postingDiscussion}
          close={() => setDisplayDiscussionDialog(false)}
        />
      </Sidebar>

      <div className="flex w-full">
        <Fieldset legend="Discussion board" className="w-full">
          <div className="flex gap-1 w-full justify-content-end">
            <div className="flex">
              <Button
                className="scalein animation-duration-500 p-button p-button-info"
                style={{ background: "#28477f", border: "0px solid #28477f" }}
                type="button"
                icon="icon icon-common icon-filter"
                onClick={(e) => opFilters.current.toggle(e)}
                aria-haspopup
                aria-controls="overlay_panel"
              />
              <OverlayPanel ref={opFilters} id="overlay_panel">
                <div className="flex block flex-row gap-2">
                  <Chips
                    value={tagsFilter}
                    onChange={(e) => setTagsFilter(e.value)}
                    separator=","
                    placeholder="Filter by tags."
                    allowDuplicate={false}
                  ></Chips>
                </div>
              </OverlayPanel>
            </div>
            <div className="flex">
              <Button
                className="scalein animation-duration-500 p-button p-button-info"
                icon="pi pi-plus"
                label="Add a New Topic"
                onClick={displayAllDiscussions}
                style={{ background: "#28477f", border: "0px solid #28477f" }}
              />
            </div>
          </div>

          {formattedDiscussions}
        </Fieldset>
      </div>

      <br />
    </React.Fragment>
  );
};

export default observer(Discussion);
