import { Tag } from "primereact/tag";
import React from "react";
import { IoPricetag } from "react-icons/io5";

const CommentTags = ({ tags }) => {
  if (!tags) {
    return <></>;
  }

  let generateTagsUI = tags.map((tag) => {
    return (
      <Tag
        style={{
          background:
            "linear-gradient(-225deg, #336633 0%, #558855 48%, #77aa77 100%)",
        }}
      >
        <div className="flex align-items-center gap-2">
          <div className="flex">
            <IoPricetag />
          </div>
          <div className="flex">
            <span className="text-sm">{tag}</span>
          </div>
        </div>
      </Tag>
    );
  });

  return <div className="flex gap-2">{generateTagsUI}</div>;
};

export default CommentTags;
