import _ from "lodash";
import { Tag } from "primereact/tag";
import React from "react";
import { FcComments } from "react-icons/fc";
const HomeLatestDiscussionBlock = ({ id, discussion }) => {
  let sectionIcon = (section) => {
    switch (section) {
      case "Gene":
        return "icon icon-conceptual icon-dna";
      case "Target":
        return "icon icon-common icon-target";
      case "Screen":
        return "icon icon-common icon-search";
      case "HA":
        return "icon icon-conceptual icon-chemical";
      case "H2L":
        return "icon icon-common icon-analyse";
      case "LO":
        return "icon icon-common icon-analyse";
      case "SP":
        return "icon icon-common icon-analyse";
      case "IND":
        return "icon icon-common icon-drug";
      case "P1":
        return "icon icon-common icon-drug";
      default:
        return "icon icon-common icon-comment";
    }
  };

  return (
    <div
      id={"_discussion_" + id}
      className="surface-50 border-round flex pl-2 pr-2 mt-1 gap-2 align-items-center border-top-1 border-black-alpha-50 "
    >
      <div className="flex w-2">
        <Tag
          value={_.capitalize(discussion.reference)}
          className="surface-overlay w-full text-color ml-2 mr-2"
        />
      </div>
      <div className="flex w-1">
        <p>
          <i className={sectionIcon(discussion.section)}></i>
        </p>
      </div>
      <div className="flex w-8 cursor-pointer">
        <p>{discussion.topic}</p>
      </div>
      <div className="flex w-2 justify-content-center align-items-center gap-1">
        <div className="flex">
          <i
            className="icon icon-common icon-user-circle"
            style={{ color: "orange" }}
          ></i>
        </div>
        <div
          className="flex"
          style={{ fontSize: "small", fontStyle: "italic" }}
        >
          {" "}
          {discussion.postedByName}
        </div>
      </div>
      <div className="flex justify-content-center align-items-center gap-1">
        <div className="flex">
          <FcComments />
        </div>
        <div className="flex" style={{ fontSize: "small", fontStyle: "bold" }}>
          {discussion.repliesCount}
        </div>
      </div>
    </div>
  );
};

export default HomeLatestDiscussionBlock;
