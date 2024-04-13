import { Tag } from "primereact/tag";
import React from "react";
import { IoIosJournal } from "react-icons/io";

const PublicationTags = ({ publications }) => {
  if (!publications || publications.length === 0) {
    return <></>;
  }
  return (
    <Tag
      style={{
        background:
          "linear-gradient(-225deg, #336699 0%, #5588bb 48%, #77aadd 100%)",
      }}
    >
      <div className="flex align-items-center">
        <IoIosJournal />

        <span className="text-xs">
          {publications.length} Publication{publications.length > 1 ? "s" : ""}
        </span>
      </div>
    </Tag>
  );
};

export default PublicationTags;
