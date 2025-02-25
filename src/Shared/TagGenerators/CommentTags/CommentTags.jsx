import { Tag } from "primereact/tag";
import React from "react";

const CommentTags = ({ tags }) => {
  if (!tags) {
    return <></>;
  }

  let generateTagsUI = tags.map((tag) => {
    return (
      <Tag
        key={tag}
        style={{
          background:
            "linear-gradient(-225deg, #678bad 20%, #7eb8b1 48%, #7389ad 100%)",
        }}
      >
        <div className="flex align-items-center gap-2">
          {/* <div className="flex">
            <IoPricetag />
          </div> */}
          <div className="flex">
            <span className="text-xs">{tag}</span>
          </div>
        </div>
      </Tag>
    );
  });

  return <div className="flex gap-2">{generateTagsUI}</div>;
};

export default CommentTags;
